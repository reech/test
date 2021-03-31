<template>
	<div>
		<div class="row">
			<div class="col-12">
				<h1>Estimert Pris</h1>
			</div>
		</div>
		<div class="row">
			<div class="col-12 py-2">
				<h5>Hei, {{ name }}</h5>
				<p>Her er din estimerte pris på forsikringen.</p>
			</div>
		</div>
		<div class="row">
			<div class=
			"col-12 py-2">
				<table class="table">
					<thead>
						<tr>
							<th>Registreringsnummer</th>
							<th>Pris</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{{ cReg }}</td>
							<td>{{ estimatedPrice }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
			<!-- Buttons -->
			<div class="form-group row">
				<div class="col-12">
					<button type="button" class="btn btn-dark btn-round" @click.prevent="buy()"><small>Kjøp</small></button>
				</div>
			</div>
	</div>
</template>

<script lang="ts">
import { EstimatedPriceRequest, EstimatedPriceResponse } from "@/types"
import Vue from "vue"
export default Vue.extend({
	name: "Home",
	props: {
		estimatedPrice: {
			required: true,
			type: String,
		},
		name: {
			required: true,
			type: String,
		},
		cReg: {
			required: true,
			type: String,
		},
	},
	mounted() {
		console.log("Price page")
	},
	methods: {
		buy(): void {
			console.log("Buying...")
		}
	},
	beforeRouteEnter(to, from, next) {
		if (Object.keys(to.params).length === 0)
			next({ name: 'Home'})
		next()
	}
})
</script>

<style lang="scss">
	.table {
		border: 1px solid grey;
	}
</style>
