<template>
	<div class="row">
		<form @submit.prevent="submit">
			<div class="row">
				<div class="col-12">
					<h1>Kjøp Bilforsikring</h1>
				</div>
			</div>
			<div class="row">
				<div class="col-12 py-2">
					<p class="mb-0">Det er fire forskjellige forsikringer å velge mellom.</p>
					<p>
						Ansvarsforsikring er lovpålagt om kjøretøyet er registrert og skal brukes på veien. I tillegg kan du utvide forsikringen avhengig av hvor gammel bilen din er og hvordan du
						bruker den.
					</p>
				</div>
			</div>

			<!-- Registrationnumber -->
			<div class="form-group row mb-4">
				<div class="col-md-6">
					<label>
						<b>Bilens registreringsnummer</b>
					</label>
					<input v-model="cReg" type="text" class="form-control" :class="{ 'is-invalid': validCReg === false, 'is-valid': validCReg }" placeholder="E.g AB 12345" />
					<div class="invalid-feedback">
						Du må fylle ut ett gyldig registreringsnummer
					</div>
				</div>
			</div>

			<!-- Your Bonus -->
			<div class="form-group row mb-4">
				<div class="col-md-6">
					<label>
						<b>Din bonus</b>
					</label>
					<select v-model="bonus" class="form-select" :class="{ 'is-invalid': validBonus === false, 'is-valid': validBonus }">
						<option selected value="" disabled>Velg din nåværende bonus</option>
						<option v-for="(bonus, k) in bonusOptions" :value="bonus" :key="k">{{ bonus }} %</option>
					</select>
				</div>
			</div>

			<!-- Birthnumber -->
			<div class="form-group row mb-4">
				<div class="col-md-6">
					<label>
						<b>Fødselsnummer</b>
					</label>
					<input v-model="birthnumber" type="number" class="form-control" :class="{ 'is-invalid': validBirthNumber === false, 'is-valid': validBirthNumber }" placeholder="11 siffer" />
					<div class="invalid-feedback">
						Skriv ett gyldig fødselsnummer
					</div>
				</div>
			</div>

			<!-- Name -->
			<div class="form-group row">
				<div class="col-md-6 mb-4">
					<label>
						<b>Fornavn</b>
					</label>
					<input v-model="firstname" type="text" class="form-control" :class="{ 'is-invalid': validFirstName === false, 'is-valid': validFirstName }" placeholder="Fornavn" />
					<div class="invalid-feedback">
						Skriv ett gyldig fornavn
					</div>
				</div>
				<div class="col-md-6 mb-4">
					<label>
						<b>Etternavn</b>
					</label>
					<input v-model="lastname" type="text" class="form-control" :class="{ 'is-invalid': validLastName === false, 'is-valid': validLastName }" placeholder="Etternavn" />
					<div class="invalid-feedback">
						Skriv ett gyldig etternavn
					</div>
				</div>
			</div>

			<!-- E-mail -->
			<div class="form-group row mb-4">
				<div class="col-md-6">
					<label>
						<b>E-post</b>
					</label>
					<input v-model="email" type="text" class="form-control" :class="{ 'is-invalid': validEmail === false, 'is-valid': validEmail }" placeholder="E-postadresse" />
					<div class="invalid-feedback">
						Skriv en gyldig e-postadresse
					</div>
				</div>
			</div>

			<!-- Buttons -->
			<div class="form-group row">
				<div class="col-12">
					<button type="submit" :disabled="!canSubmit" class="btn btn-dark btn-round" :class="{ 'btn-loading': inProgress }" @click.prevent="submit()"><small>Beregn pris</small></button
					>&nbsp;
					<button type="button" class="btn btn-light btn-round" @click.prevent="cancel()"><small>Avbryt</small></button>
				</div>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { HomeData, EstimatedPriceRequest, EstimatedPriceResponse } from "@/types"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import Vue from "vue"
export default Vue.extend({
	name: "Home",
	data(): HomeData {
		return {
			inProgress: false,
			cReg: "",
			bonus: "",
			bonusOptions: [10, 20, 30, 40, 50, 60, 70, 75],
			birthnumber: "",
			firstname: "",
			lastname: "",
			email: "",
			estimatedPrice: 0
		}
	},
	mounted() {
		console.log("Home page")
	},
	methods: {
		async submit(): Promise<void> {
			this.inProgress = true
			try {
				// fake this network call
				var mock = new MockAdapter(axios, { delayResponse: 2000 })
				const req: EstimatedPriceRequest = {
					cReg: this.cReg,
					bonus: this.bonus,
					birthnumber: this.birthnumber,
					firstname: this.firstname,
					lastname: this.lastname,
					email: this.email,
				}
				const server = "https://server_from_some_config_json"
				mock.onPost(`${server}/api/price/calculate`).reply(200, {
					estimatedPrice: 2999,
				})
				const { data } = await axios.post<EstimatedPriceResponse>(`${server}/api/price/calculate`, req)
				this.inProgress = false
				this.estimatedPrice = data.estimatedPrice
				this.$router.push({ name: 'Price', params: {
					estimatedPrice: data.estimatedPrice.toString(),
					name: this.name,
					cReg: this.cReg
				}})
			} catch (e) {
				console.error("Error", e)
				this.inProgress = false
			}
		},
		isDefault(prop: any): boolean {
			return typeof prop === "undefined" || prop === "" ? true : false
		},
		cancel(): void {
			this.cReg = ""
			this.bonus = ""
			this.birthnumber = ""
			this.firstname = ""
			this.lastname = ""
			this.email = ""
		},
		capitalize(s: string): string {
			return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
		}
	},
	computed: {
		validCReg(): boolean | null {
			if (this.isDefault(this.cReg)) return null
			const r: RegExp = /^([A-Z]){2}( )(\d{5})$/
			return r.test(String(this.cReg))
		},
		validBonus(): boolean | null {
			if (this.isDefault(this.bonus)) return null
			if (typeof this.bonus === "number") return this.bonusOptions.includes(this.bonus)
			else return false
		},
		validBirthNumber(): boolean | null {
			if (this.isDefault(this.birthnumber)) return null
			const r: RegExp = /^\d{11}$/
			return r.test(String(this.birthnumber))
		},
		validFirstName(): boolean | null {
			if (this.isDefault(this.firstname)) return null
			const r: RegExp = /^([a-zA-ZæøåÆØÅ]){2,}([a-zA-ZæøåÆØÅ ])*$/
			return r.test(String(this.firstname))
		},
		validLastName(): boolean | null {
			if (this.isDefault(this.lastname)) return null
			const r: RegExp = /^([a-zA-ZæøåÆØÅ]){2,}([a-zA-ZæøåÆØÅ ])*$/
			return r.test(String(this.lastname))
		},
		validEmail(): boolean | null {
			if (this.isDefault(this.email)) return null
			const r: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			return r.test(String(this.email).toLowerCase())
		},
		canSubmit(): boolean {
			return this.validCReg === true && this.validBonus === true && this.validBirthNumber === true && this.validFirstName === true && this.validLastName === true && this.validEmail === true
		},
		name(): string {
			const firstname: string = this.capitalize(this.firstname)
			const lastname: string = this.capitalize(this.lastname)
			return firstname + " " + lastname
		}
	},
})
</script>
