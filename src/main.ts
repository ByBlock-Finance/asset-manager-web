import { createApp } from 'vue'

//SET UP MORALIS SERVER
import moralis from 'moralis';
const serverUrl = "https://m4bxc6hy416a.usemoralis.com:2053/server";
const appId = "nL1ODkPGVyunVonmaTwq8GKPbEMtNemtfbXImdmq";
moralis.start({ serverUrl, appId });

import './assets/css/main.scss'
import './assets/theme/theme.css'
// import 'primevue/resources/themes/md-light-deeppurple/theme.css'
// import 'primevue/resources/themes/md-light-deeppurple/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import Calendar from 'primevue/calendar'
import router from './router'
import store from './store'
import primevueConfig from './config/primevueConfig'
import Button from 'primevue/button';
import Message from 'primevue/message';
import Avatar from 'primevue/avatar';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import InputText from 'primevue/inputtext';
import Tooltip from 'primevue/tooltip';
import InputSwitch from 'primevue/inputswitch';
import ProgressSpinner from 'primevue/progressspinner';
import SplitButton from 'primevue/splitbutton';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import Dialog from 'primevue/dialog';
import ProgressBar from 'primevue/progressbar';
import Chip from 'primevue/chip';
import Carousel from 'primevue/carousel';
import ScrollPanel from 'primevue/scrollpanel';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';


createApp(App)
.use(store)
.use(router)
.use(PrimeVue, primevueConfig)
.use(ToastService)
.component('DataTable', DataTable)
.component('Column', Column)
.component('ProgressBar', ProgressBar)
.component('InputText', InputText)
.component('ColumnGroup', ColumnGroup)
.component('Avatar', Avatar)
.component('Chip', Chip)
.component('Message', Message)
.component('InputSwitch', InputSwitch)
.component('ProgressSpinner', ProgressSpinner)
.component('SplitButton', SplitButton)
.component('Button', Button)
.component('Splitter', Splitter)
.component('SplitterPanel', SplitterPanel)
.component('Toast', Toast)
.component('Carousel', Carousel)
.component('ScrollPanel', ScrollPanel)
.component('Dialog', Dialog)
.component('Dropdown', Dropdown)
.component('MultiSelect', MultiSelect)
.directive('Tooltip', Tooltip)
.mount('#app')
