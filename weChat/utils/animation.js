function loadingAnimation() {
	this.finger = {}
	const topPoint = {}
	
	this.finger['x'] = e.touches['0'].clientX
	this.finger['y'] = e.touches['0'].clientY
	
	if (this.finger['y'] < this.busPos['y']) {
		topPoint['y'] = this.finger['y'] - 150
	} else {
		topPoint['y'] = this.busPos['y'] - 150
	}
	topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2
	
	if (this.finger['x'] > this.busPos['x']) {
		topPoint['x'] = (this.finger['x'] - this.busPos['x']) / 2 + this.busPos['x']
	} else {
		topPoint['x'] = (this.busPos['x'] - this.finger['x']) / 2 + this.finger['x']
	}
	
	this.linePos = this.bezier([this.busPos, topPoint, this.finger], 30)
	this.startAnimation(e)
}

function startAnimation(e) {
	let index = 0
	const that = this
	const bezier_points = that.linePos['bezier_points']
	index = bezier_points.length
	that.hide_good_box = false
	that.bus_x = that.finger['x']
	that.bus_y = that.finger['y']
	
	const animation = wx.createAnimation({
		duration: 30,
		timingFunction: 'ease-out'
	})
	
	animation.opacity(1).step()
	
	for (let i = index - 1; i > -1; i--) {
		const deltx = bezier_points[i]['x'] - that.finger['x']
		const delty = bezier_points[i]['y'] - that.finger['y']
		animation.translate(deltx, delty).step()
	}
	
	animation.opacity(0).step()
	this.animation = animation.export()
}

function bezier(posArr, amount) {
	let pot, lines, points
	const ret = []
	
	for (let i = 0; i <= amount; i++) {
		points = posArr.slice(0)
		lines = []
		while((pot = points.shift())) {
			if (points.length) {
				lines.push(pointLine([pot, points[0]], i / amount))
			} else if (lines.length > 1) {
				points = lines
				lines = []
			} else {
				break
			}
		}
		ret.push(lines[0])
	}
	
	function pointLine(points, rate) {
		const pointA = points[0] //点击
		const pointB = points[1] //中间
		const xDistance = pointB.x - pointA.x
		const yDistance = pointB.y - pointA.y
		const pointDistance = Math.pow(
			Math.pow(xDistance, 2) + Math.pow(yDistance, 2),
			1 / 2
		)
		const tan = yDistance / xDistance
		const radian = Math.atan(tan)
		const tmpPointDistance = pointDistance * rate
		return {
			x: pointA.x + tmpPointDistance * Math.cos(radian),
			y: pointA.y + tmpPointDistance * Math.sin(radian)
		}
	}
	
	return {
		bezier_points: ret
	}
}