const Dict = {
	backPayType: [
		{
			label: '微信', value: 0
		},
		{
			label: '补贴账号', value: 1
		}
	],
	
	cacheDictMap: new Map(),
	
	get: (dictName, key) => {
		if (!Dict.hasOwnProperty(dictName)) return null
		
		if (Dict.cacheDictMap.get(dictName) === undefined) {
			const dictFunc = Dict.createDict(Dict[dictName])
			if (dictFunc) {
				Dict.cacheDictMap.set(dictName, dictFunc)
			} else {
				return null
			}
		}
		
		return Dict.cacheDictMap.get(dictName)(key)
	},
	
	set: (dictName = '', source = []) => {
		if (dictName && source[0]) {
			Dict[dictName] = source
		}
	},
	
	createDict: (source) => {
		const enumMap = new Map()
		source.map(item => {
			enumMap.set(item.label, item.value)
			enumMap.set(String(item.value), item.label)
			enumMap.set(Number(item.value), item.label)
		})
		
		return (key) => {
			if (key !== undefined && enumMap.get(key) !== undefined) {
				return enumMap.get(key)
			}
			return null
		}
	}
}

export default Dict

//example: Dict.get('serviceType', 1) ---> '在线咨询'