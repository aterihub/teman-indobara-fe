<template>
<sideNav :isSettingActive="true" /> 
<div class="content">
  <div class="navigation">
    <Chip :tabs="tabs" @clicked="changeNavigation" />
  </div>
  <div class="form">
    <component :is="selectedComponent" />
  </div>
</div>
</template> 
         
<script>
import Chip from '@/components/tab/Tab.vue' 
import DevicesMaster from '@/views/Setting/Devices/DevicesMaster.vue'
import ManufacturesMaster from '@/views/Setting/Devices/manufactures/ManufacturesMaster.vue'
import DeviceInfo from '@/views/Devices/DeviceInfo.vue'
import EditDevice from '@/views/Devices/EditDevice.vue'
import sideNav from '@/components/navigation/sideNav.vue'
import Button from '@/components/button/BaseButton.vue'
import SearchBar from '@/components/SearchBar.vue'
import { onMounted, ref } from 'vue'

  export default {
    components: {
      Chip,DeviceInfo , EditDevice, sideNav, Button, SearchBar, DevicesMaster, ManufacturesMaster
    },
    props: ['id'],

    setup(props) {
      const selectedComponent = ref('ManufacturesMaster')
      const tabs = [
        {
          title: 'Manufacturer',
          value: 'ManufacturesMaster',
          icon: "M22.7339 6.16113C23.1907 6.16119 23.6315 6.32888 23.9728 6.63237C24.3141 6.93587 24.5322 7.35408 24.5856 7.80767L24.5986 8.02584V37.8612C24.5981 38.3365 24.4161 38.7936 24.0899 39.1392C23.7636 39.4848 23.3177 39.6928 22.8432 39.7206C22.3688 39.7485 21.9016 39.5941 21.5371 39.2891C21.1726 38.984 20.9384 38.5513 20.8823 38.0794L20.8692 37.8612V8.02584C20.8692 7.53129 21.0657 7.05699 21.4154 6.70729C21.7651 6.35759 22.2394 6.16113 22.7339 6.16113ZM15.2751 11.7553C15.7318 11.7553 16.1726 11.923 16.514 12.2265C16.8553 12.53 17.0733 12.9482 17.1267 13.4018L17.1398 13.62V32.2671C17.1393 32.7424 16.9573 33.1995 16.631 33.5451C16.3048 33.8907 15.8588 34.0987 15.3844 34.1265C14.9099 34.1544 14.4427 34 14.0783 33.695C13.7138 33.3899 13.4796 32.9572 13.4234 32.4853L13.4104 32.2671V13.62C13.4104 13.1254 13.6068 12.6511 13.9565 12.3014C14.3062 11.9517 14.7805 11.7553 15.2751 11.7553ZM30.1928 11.7553C30.6495 11.7553 31.0903 11.923 31.4316 12.2265C31.7729 12.53 31.991 12.9482 32.0444 13.4018L32.0575 13.62V32.2671C32.057 32.7424 31.875 33.1995 31.5487 33.5451C31.2224 33.8907 30.7765 34.0987 30.3021 34.1265C29.8276 34.1544 29.3604 34 28.9959 33.695C28.6315 33.3899 28.3973 32.9572 28.3411 32.4853L28.3281 32.2671V13.62C28.3281 13.1254 28.5245 12.6511 28.8742 12.3014C29.2239 11.9517 29.6982 11.7553 30.1928 11.7553ZM7.81625 17.3494C8.27298 17.3495 8.7138 17.5171 9.05511 17.8206C9.39642 18.1241 9.61447 18.5423 9.66791 18.9959L9.68096 19.2141V26.6729C9.68043 27.1482 9.49844 27.6054 9.17218 27.951C8.84591 28.2966 8.39999 28.5045 7.92553 28.5324C7.45107 28.5602 6.98388 28.4059 6.61942 28.1008C6.25495 27.7958 6.02073 27.3631 5.96459 26.8911L5.95154 26.6729V19.2141C5.95154 18.7196 6.148 18.2453 6.4977 17.8956C6.8474 17.5459 7.3217 17.3494 7.81625 17.3494ZM37.6516 17.3494C38.1083 17.3495 38.5492 17.5171 38.8905 17.8206C39.2318 18.1241 39.4498 18.5423 39.5033 18.9959L39.5163 19.2141V26.6729C39.5158 27.1482 39.3338 27.6054 39.0075 27.951C38.6813 28.2966 38.2354 28.5045 37.7609 28.5324C37.2864 28.5602 36.8192 28.4059 36.4548 28.1008C36.0903 27.7958 35.8561 27.3631 35.8 26.8911L35.7869 26.6729V19.2141C35.7869 18.7196 35.9834 18.2453 36.3331 17.8956C36.6828 17.5459 37.1571 17.3494 37.6516 17.3494Z"
        },   
        {
          title: 'Devices',
          value: 'DevicesMaster',
          icon: "M39.6998 11.7031L24.3159 3.2857C23.9049 3.05859 23.443 2.93945 22.9733 2.93945C22.5037 2.93945 22.0418 3.05859 21.6308 3.2857L6.24689 11.7066C5.80756 11.947 5.44082 12.3009 5.18497 12.7314C4.92913 13.1619 4.79356 13.6533 4.79242 14.1541V30.8735C4.79356 31.3743 4.92913 31.8656 5.18497 32.2961C5.44082 32.7266 5.80756 33.0806 6.24689 33.3209L21.6308 41.7419C22.0418 41.969 22.5037 42.0881 22.9733 42.0881C23.443 42.0881 23.9049 41.969 24.3159 41.7419L39.6998 33.3209C40.1391 33.0806 40.5059 32.7266 40.7617 32.2961C41.0176 31.8656 41.1531 31.3743 41.1543 30.8735V14.1558C41.1541 13.6541 41.0189 13.1617 40.7631 12.7302C40.5072 12.2987 40.1399 11.9439 39.6998 11.7031ZM22.9733 21.117L8.92683 13.4251L22.9733 5.73314L37.0199 13.4251L22.9733 21.117ZM24.3719 38.5357V23.5347L38.3572 15.8812V30.8735L24.3719 38.5357Z"
        }
      ]
 
      function changeNavigation(navigation) {
        var subNavs = document.getElementsByClassName("nav")
        console.log(subNavs)
        for (var i of subNavs) {
          i.classList.remove("active");
        }
        // var element = document.getElementById("Devices");
        // element.classList.add("active");
        console.log(navigation)
        event.target.className += " active"
        selectedComponent.value = navigation
      }

      onMounted(async() => {
        var element = document.getElementById("Manufacturer");
        element.classList.add("active");
      })

      return {
        selectedComponent,
        tabs, 
        changeNavigation
      }
    }
  }
  
</script>
        
<style scoped>
.content {
    @apply relative w-full h-full flex flex-col gap-6
}

.navigation {
  @apply flex w-fit
}
.form {
  @apply 
    w-full rounded-lg bg-white
}
</style>