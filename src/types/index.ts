type Bonus = number[]

export type HomeData = {
	inProgress: boolean
	cReg: string
	bonus: string
	bonusOptions: Bonus,
	birthnumber: string
	firstname: string
	lastname: string
	email: string
}

export type EstimatedPriceRequest = Omit<HomeData, "inProgress"|"bonusOptions"|"estimatedPrice">

export type EstimatedPriceResponse = {
	estimatedPrice: number
}