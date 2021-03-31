import { shallowMount, Wrapper, createLocalVue } from "@vue/test-utils";
import { AxiosResponse } from "axios"
import { routes } from "@/router"
import Home from "@/views/Home.vue";
import Vue from "vue"
import VueRouter from 'vue-router'
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter({routes})


describe("Home.vue", () => {
  let cmp: Wrapper<Vue>;

  beforeEach(() => {
    cmp = shallowMount(Home, {
		localVue,
		router
	});
  });

  it("Can submit if all inputs validated", () => {
    cmp.setData({
		inProgress: false,
		cReg: "AB 12345",
		bonus: 75,
		birthnumber: "12345123451",
		firstname: "Ola",
		lastname: "Normann",
		email: "ola@normann.no"
    });
    expect((cmp as any).vm.canSubmit).toBe(true);
  });

  it("Can validate email, birthnumber etc..", () => {
    cmp.setData({
		email: "wrong"
    });
    expect((cmp as any).vm.validEmail).toBe(false);
  });

  it("Can submit and get estimatedPrice from backend", async () => {

	// could also fill in manually in input fields by finding id, click submit button and await nextTick, but let's keep it simple. Default is 0 so anything greater is a succesful response.
    cmp.setData({
		inProgress: false,
		cReg: "AB 12345",
		bonus: 75,
		birthnumber: "12345123451",
		firstname: "Ola",
		lastname: "Normann",
		email: "ola@normann.no"
    });

	await (cmp as any).vm.submit()
	expect((cmp as any).vm.estimatedPrice).toBeGreaterThan(0)
  });

});
