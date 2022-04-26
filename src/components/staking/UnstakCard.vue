<template>
  <div class="stak">
    <div class="d-flex align-center checking">
      <h3>Unstack</h3>
      <div class="d-flex checkeboxes">
        <button class="btn-check ml-2" :class="{active: stack === 'c-01'}">
          <input id="uc-01" type="radio" name="unstack" v-model="stack" value="c-01" />
          <label for="uc-01">c-01</label>
        </button>
        <button class="btn-check ml-2" :class="{active: stack === 'c-02'}">
          <input id="uc-02" type="radio" name="unstack" v-model="stack" value="c-02" />
          <label for="uc-02">c-02</label>
        </button>
      </div>
    </div>
    <div class="d-flex texts">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
    </div>
    <div class="d-flex stak-ids">
      <div class="form-group">
        <label>C-01 IDs</label>
        <div class="mt-1">
        <div class="stak-id"
        @click="removeStak(sta)"
        v-for="sta in staks" :key="sta">ID: {{sta}}
        <i class="fas fa-times"></i></div>
        </div>
      </div>
      <div class="qty d-flex ">
        <p>Quantity</p>
        <p>Staking 1 c01</p>
      </div>
      <div class="reward-per-day d-flex">
        <p>C-01 reward increase</p>
        <div class="increase-per-day">+ 65 c01 / day</div>
      </div>
    </div>
    <div class="d-flex stak-btn">
      <button class="approve-stack-btn">Approve Unstaking</button>
    </div>
  </div>
</template>
<script>
export default {
  data : () => ({
    stack: 'c-01',
    ids: '',
    staks: ['997', '881', '335']
  }),
  methods:{
    removeStak(stak){
      this.staks.splice(this.staks.indexOf(stak), 1);
    }
  }
}
</script>
<style lang="scss" scoped>
.stak h3{
  font-size: 22px;
  text-transform: uppercase;
  text-shadow: 0 0 3px #ffffff;
}
.d-flex{
  display: flex;
}
.align-center{
  align-items: center;
}
.ml-2{
  margin-left: 8px;
}
.checkeboxes input{
  display: none;
}
.btn-check{
  border: 1px solid #eea1c5;
  border-radius: 3px;
  background: rgba(130, 18, 70, 0.8);
  opacity: 0.5;
  padding: 8px 5px;
  cursor: pointer;
  label{
    cursor: pointer;
    display: block;
  }
}
.mt-1{
  margin-top: 4px;
}
.btn-check.active{
  opacity: 1;
}
.texts{
  margin: 30px 0;
}
.stak-ids{
  padding-top: 30px;
  border-top: 1px solid #fff;
  width: 100%;
  flex-wrap: wrap;
}
.form-group{
  width: 100%;
  text-align: left;
  margin-bottom: 30px;
  label{
    text-align: left;
  }
  .input-field{
    margin-top: 5px;
    width: 100%;
    border: 1px solid #821246;
    background: #821246;
    padding: 7px;
    outline: none;
    color: white;
  }
}

.stak-id{
  border: 1px solid #821246;
  background: #821246;
  display: inline-block;
  margin: 0 2px;
  padding: 3px 12px 3px 5px;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  opacity: 0.9;
  position: relative;
  .fa-times{
    position: absolute;
    font-size: 10px;
    top: 0;
    right: 1px;
  }
  &:hover{
    opacity: 1;
    box-shadow: 0px 0px 7px 0px #ffffff;
  }
}

.qty,.reward-per-day{
  justify-content: space-between;
  width: 100%;
  margin-bottom: 15px;
  .increase-per-day{
    color: #ff74b4;
  }
}

.stak-btn{
  width: 100%;
  display: flex;
  justify-content: center;
  button{
    border-radius: 3px;
    border: 1px solid #eea1c5;
    padding: 8px 25px;
    background: #6d0234;
    font-size: 16px;
    letter-spacing: 1.5px;
    display: flex;
    align-items: center;
    font-weight: bold;
    min-width: 230px;
    text-align: center;
    display: flex;
    justify-content: center;
  }
}
</style>