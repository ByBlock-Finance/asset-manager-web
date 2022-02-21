<template>
  <div class="input-container">
    <label>
      <span v-if="title" class="title">{{ title }}</span>
      <Calendar class="input" :modelValue="modelValue" dateFormat="dd.mm.yy" :placeholder="modelValue" @update:modelValue="emitChange"/>
    </label>
  </div>
</template>

<script>
export default {
  name: 'DateInputField',
  created() {
        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let prevMonth = (month === 0) ? 11 : month -1;
        let prevYear = (prevMonth === 11) ? year - 1 : year;
        let nextMonth = (month === 11) ? 0 : month + 1;
        let nextYear = (nextMonth === 0) ? year + 1 : year;
        this.minDate = new Date();
        this.minDate.setMonth(prevMonth);
        this.minDate.setFullYear(prevYear);
        this.maxDate = new Date();
        this.maxDate.setMonth(nextMonth);
        this.maxDate.setFullYear(nextYear);

        let invalidDate = new Date();
        invalidDate.setDate(today.getDate() - 1);
        this.invalidDates = [today,invalidDate];
    },
  data() {
      return {
          date: null,
      }
  },
  props: {
    title: String,
    placeholder: String,
    modelValue: [String, Number],
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitChange(value) {
      this.$emit('update:modelValue', value);
    },
  },
}
</script>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.input-container .title {
  display: flex;
  font-family: DM Sans Bold;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #4C5055;
  margin-bottom: 6px;
  user-select: none;
}

.input-container .input {
  display: flex;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  appearance: none;
  outline: none;
}

.input-container .input:focus {
  box-shadow: 0 0 0 2px #737372, 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.input-container .input:disabled {
  background-color: #E8E8E8;
  box-shadow: none;
}

.input-container .input.error {
  box-shadow: 0 0 0 1px #FD545A;
}

.input-container .input::placeholder {
  font-family: DM Sans;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;
  color: #737372;
}
</style>
<style>
.p-inputtext {
    background: #FFFFFF !important;
    box-shadow: 0 0 0 1px #D5D6D5 !important;
    padding: 12px !important;
    border: none !important;
    transition: none !important;
    border-radius: 6px !important;
}
.p-inputtext:enabled:hover {
    border-color: unset !important;
    box-shadow: 0 0 0 1px #d5d6d5 !important;
}

.p-inputtext:enabled:focus {
  box-shadow: 0 0 0 2px #737372, 0px 2px 8px rgba(0, 0, 0, 0.1) !important;
}
.p-datepicker table td > span.p-highlight {
    color: #ffffff !important;
    background: #CC0000 !important;
}

.p-datepicker table td > span:focus {
    box-shadow: none !important;
}
</style>
