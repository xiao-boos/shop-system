/**
 * 获取今天和明天的日期，格式为 yyyy.mm.dd
 * @return {Object} {{today: string, tomorrow: string}}
 */
export const getTodayAndTomorrow = () => {
	const today = new Date()
	const tomorrow = new Date()
	tomorrow.setDate(today.getDate() + 1)
	const todayFormatted = formatDate(today)
	const tomorrowFormatted = formatDate(tomorrow)
	return {
		today: todayFormatted,
		tomorrow: tomorrowFormatted
	}
}

/**
 * 获取倒计时时间
 * @param days
 * @param endTime
 * @return {string}
 */
export function countdown(days, endTime) {
	// 获取当前时间
	const now = new Date();
	
	// 设置结束时间
	const end = new Date();
	end.setHours(endTime.split(':')[0]);
	end.setMinutes(endTime.split(':')[1]);
	end.setSeconds(endTime.split(':')[2]);
	
	// 计算剩余时间
	const remainingTime = (end.getTime() - now.getTime()) / 1000;
	
	// 根据days参数调整结束时间
	if (days > 0) {
		end.setDate(end.getDate() + days);
	}
	
	// 获取剩余时间的小时、分钟和秒数
	const hours = Math.floor(remainingTime / 3600);
	const minutes = Math.floor((remainingTime % 3600) / 60);
	const seconds = Math.floor(remainingTime % 60);
	
	// 格式化剩余时间为HH:mm:ss
	return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const formatDate = (date) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}.${month}.${day}`
}

