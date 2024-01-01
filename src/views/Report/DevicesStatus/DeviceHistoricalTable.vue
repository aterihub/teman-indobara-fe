<template>
  <!-- <alert :message="status.message" :modalActive="status.isError" :isError="status.isError" @close="closeNotification" /> -->
  <sideNav :isReportActive="true" />
  <h1 class="title">Device History Health Status</h1>
  <div class="device-container">
    <div class="flex gap-6">
      <button class="back-btn" @click="devicesRealtime">
        <svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11.4375 18.75L4.6875 12L11.4375 5.25M5.625 12H19.3125" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        Back
      </button>
      <div class="flex items-center justify-between w-full text-sm">
        <div class="flex gap-4">
          <p class="font-medium">Device IMEI: {{ props.deviceImei }}</p>
          <p class="font-medium">Device Type: {{ props.deviceType }}</p>
        </div>
        <div class="flex gap-4 items-center">
          <p class="font-medium">Today</p>
          <select name="siteFilter" id="siteFilter"
            class="outline-none text-[12px] text-[#353535] p-2 border border-[#D9D9D9] rounded-md cursor-pointer h-fit w-fit"
            v-model="selectedTime" @change="loadDevicesReport()">
            <option class="p-2 cursor-pointer" value="0">00:00 - 01:00</option>
            <option class="p-2 cursor-pointer" value="1">01:00 - 02:00</option>
            <option class="p-2 cursor-pointer" value="2">02:00 - 03:00</option>
            <option class="p-2 cursor-pointer" value="3">03:00 - 04:00</option>
            <option class="p-2 cursor-pointer" value="4">04:00 - 05:00</option>
            <option class="p-2 cursor-pointer" value="5">05:00 - 06:00</option>
            <option class="p-2 cursor-pointer" value="6">06:00 - 07:00</option>
            <option class="p-2 cursor-pointer" value="7">07:00 - 08:00</option>
            <option class="p-2 cursor-pointer" value="8">08:00 - 09:00</option>
            <option class="p-2 cursor-pointer" value="9">09:00 - 10:00</option>
            <option class="p-2 cursor-pointer" value="10">10:00 - 11:00</option>
            <option class="p-2 cursor-pointer" value="11">11:00 - 12:00</option>
            <option class="p-2 cursor-pointer" value="12">12:00 - 13:00</option>
            <option class="p-2 cursor-pointer" value="13">13:00 - 14:00</option>
            <option class="p-2 cursor-pointer" value="14">14:00 - 15:00</option>
            <option class="p-2 cursor-pointer" value="15">15:00 - 16:00</option>
            <option class="p-2 cursor-pointer" value="16">16:00 - 17:00</option>
            <option class="p-2 cursor-pointer" value="17">17:00 - 18:00</option>
            <option class="p-2 cursor-pointer" value="18">18:00 - 19:00</option>
            <option class="p-2 cursor-pointer" value="19">19:00 - 20:00</option>
            <option class="p-2 cursor-pointer" value="20">20:00 - 21:00</option>
            <option class="p-2 cursor-pointer" value="21">21:00 - 22:00</option>
            <option class="p-2 cursor-pointer" value="22">22:00 - 23:00</option>
            <option class="p-2 cursor-pointer" value="23">23:00 - 24:00</option>
          </select>
        </div>
      </div>

    </div>
    <EasyDataTable header-text-direction="center" body-text-direction="center" table-class-name="customize-table"
      :headers="header" :items="devicesReport" theme-color="#1363df" rows-per-page="15"
      :loading="getDevicesReportIsLoading">
      <!-- <template #item-status="item">
        <Indicator :status="item.status" />
      </template>
      <template #item-time="item">
        {{ item.deviceHealth.time }}
      </template>
      <template #item-elapsedTime="item">
        {{ item.deviceHealth.elapsedTime }}
      </template>
      <template #item-gsmSignal="item">
        {{ item.deviceHealth.gsmSignal }}
      </template>
      <template #item-batteryPercentage="item">
        {{ item.deviceHealth.batteryPercentage }}
      </template>
      <template #item-satellite="item">
        {{ item.deviceHealth.satellite }}
      </template> -->
      <template #item-coordinate="item">
        <p>{{ item.latitude }}, {{ item.longitude }}</p>
        <!-- <a :href="item.deviceHealth.maps" target="_blank">{{ item.latitude }}</a> -->
      </template>
      <template #expand="item">
        <div v-if="props.deviceType === 'ADAS'" class="grid grid-cols-4 text-left px-6 py-2 gap-2">
          <p v-for="(value, key) in item.event" :class="value !== 0 ?  'font-semibold text-red-500' : ''">
            {{ key }}: {{ value }}
          </p>
        </div>
        <div v-if="props.deviceType === 'DSM'" class="grid grid-cols-4 text-left px-6 py-2 gap-2">
          <p v-for="(value, key) in item.event" :class="value !== 0 ?  'font-semibold text-red-500' : ''">
            {{ key }}: {{ value }}
          </p>
        </div>
        <div v-if="props.deviceType === 'MDVR'" class="grid grid-cols-4 text-left px-6 py-2 gap-2">
          <p v-for="(value, key) in item.event" :class="value !== 0 ?  'font-semibold text-red-500' : ''">
            {{ key }}: {{ value }}
          </p>
        </div>
      </template>
      <!-- <template #expand="item">
        <div v-if="item.adasDetail" class="grid grid-cols-3 p-2">
          <div class="col-span-1 flex flex-col gap-1 text-left">
            <h1 class="font-medium">ADAS State</h1>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>State: </p>
              <p class="font-medium">{{ item.deviceHealth.adasState }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Error Code: </p>
              <p class="font-medium">{{ item.adasDetail.errorCode }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>SD Card Status: </p>
              <p class="font-medium">{{ item.adasDetail.sdcard }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Recording Status: </p>
              <p class="font-medium">{{ item.adasDetail.record }}</p>
            </div>
          </div>
          <div class="col-span-2 flex flex-col gap-1 text-left">
            <h1 class="font-medium">ADAS Events</h1>
            <div class="grid grid-cols-2 gap-6">
              <div class="flex flex-col gap-1">
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.lwdLeft._value === 0,
                    'green-chip': item.events.lwdLeft._value === 1,
                    'red-chip': item.events.lwdLeft._value === 2
                  }">
                    L Lane Departure
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.lwdLeft._value === 0,
                    'green-chip': item.events.lwdLeft._value === 1,
                    'red-chip': item.events.lwdLeft._value === 2
                  }">
                    R Lane Departure
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.leftTurnSignal._value === 0,
                    'green-chip': item.events.leftTurnSignal._value === 1
                  }">
                    Left Turn Signal
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.rightTurnSignal._value === 0,
                    'green-chip': item.events.rightTurnSignal._value === 1
                  }">
                    Right Turn Signal
                  </div>
                </div>
                <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                  'grey-chip': item.events.brakeSignal._value === 0,
                  'green-chip': item.events.brakeSignal._value === 1
                }">
                  Brake Signal
                </div>
                <div class="grid grid-cols-5 gap-2 mb-4">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.sda._value === 0,
                    'green-chip': item.events.sda._value === 1,
                    'red-chip': item.events.sda._value === 2
                  }">
                    SDA
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fvsa._value === 0,
                    'green-chip': item.events.fvsa._value === 1,
                    'red-chip': item.events.fvsa._value === 2
                  }">
                    FVSA
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fpw._value === 0,
                    'green-chip': item.events.fpw._value === 1,
                    'red-chip': item.events.fpw._value === 2
                  }">
                    FPW
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.fcw._value === 0,
                    'green-chip': item.events.fcw._value === 1,
                    'red-chip': item.events.fcw._value === 2
                  }">
                    FCW
                  </div>
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'yellow-chip': item.events.pcw._value === 0,
                    'green-chip': item.events.pcw._value === 1,
                    'red-chip': item.events.pcw._value === 2
                  }">
                    PCW
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Speed</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.speed._value }} km/h</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">RPM</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.rpm._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Time Till Collision</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.timeTillCollision._value }} second
                    </h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Ahead Distance</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.aheadDistance._value }} </h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Ahead Speed</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.aheadSpeed._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Distance Left</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.distanceLeft._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">Distance Right</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.distanceRight._value }}</h1>
                  </div>
                </div>
                <div class="grid grid-cols-3">
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR State</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrState._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR Recognize</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrRecognize._value }}</h1>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label for="batt" class="text-xs text-[#353535]/60">SLR Sensitivity</label>
                    <h1 class="font-medium text-xs text-[#353535]">{{ item.events.slrSensitivity._value }}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="item.dsmDetail" class="grid grid-cols-3 p-2">
          <div class="col-span-1 flex flex-col gap-1 text-left">
            <h1 class="font-medium">DSM State</h1>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>State: </p>
              <p class="font-medium">{{ item.deviceHealth.dsmState }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Error Code: </p>
              <p class="font-medium">{{ item.dsmDetail.errorCode }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>GPS Status: </p>
              <p class="font-medium">{{ item.dsmDetail.gpsStatus }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Recording Status: </p>
              <p class="font-medium">{{ item.dsmDetail.recordingStatus }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Active Driver Name: </p>
              <p class="font-medium">{{ item.dsmDetail.operator }}</p>
            </div>
            <div class="grid grid-cols-2 text-left gap-2">
              <p>Speed: </p>
              <p class="font-medium">{{ item.dsmDetail.speed }}</p>
            </div>
          </div>
          <div class="col-span-2 flex flex-col gap-1 text-left">
            <h1 class="font-medium">DSM Events</h1>
            <div class="grid grid-cols-3 gap-6 h-full">
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': item.events.drowsiness._value === 0,
                    'red-chip': item.events.drowsiness._value === 1
                  }">
                    Drowsiness
                  </div>
                  <div class="flex flex-col col-span-2 gap-1">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ item.events.drowsiness.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ item.events.drowsiness.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.distraction._value === 0,
                    'red-chip': dsmData.events.distraction._value === 1
                  }">
                    Disctraction
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.distraction.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.distraction.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.yawning._value === 0,
                    'red-chip': dsmData.events.yawning._value === 1
                  }">
                    Yawning
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.yawning.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.yawning.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.phone._value === 0,
                    'red-chip': dsmData.events.phone._value === 1
                  }">
                    Phone
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.phone.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.phone.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.smoking._value === 0,
                    'red-chip': dsmData.events.smoking._value === 1
                  }">
                    Smoking
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.smoking.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.smoking.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.driverAbsence._value === 0,
                    'red-chip': dsmData.events.driverAbsence._value === 1
                  }">
                    Driver Absence
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.driverAbsence.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.driverAbsence.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.mask._value === 0,
                    'red-chip': dsmData.events.mask._value === 1
                  }">
                    Mask
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.mask.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.mask.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.seatbelt._value === 0,
                    'red-chip': dsmData.events.seatbelt._value === 1
                  }">
                    Seatbelt
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.seatbelt.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.seatbelt.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-4 items-center">
                  <div class="rounded-full p-2 text-center text-[10px] text-white font-medium h-fit" :class="{
                    'grey-chip': dsmData.events.gsensor._value === 0,
                    'red-chip': dsmData.events.gsensor._value === 1
                  }">
                    G-Sensor
                  </div>
                  <div class="flex flex-col gap-1 col-span-2">
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Last Update:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.gsensor.time }}</h1>
                    </div>
                    <div class="flex gap-1">
                      <label for="batt" class="font-medium text-xs text-[#353535]/70">Elapsed Time:</label>
                      <h1 class="font-medium text-xs text-[#353535]">{{ dsmData.events.gsensor.elapsedTime }}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template> -->
    </EasyDataTable>
  </div>
</template>

<script setup>
import lazyCard from '@/components/loading/lazyCard.vue';
import sideNav from '@/components/navigation/sideNav.vue'
import { onBeforeMount, ref, onUnmounted } from 'vue';
import router from '@/router'
//indicators
import Indicator from '@/components/Indicator.vue'
import SignalIndicator from '@/components/SignalIndicator.vue';
import GPSIndicator from '@/components/GPSIndicator.vue';
import BatteryIndicator from '@/components/BatteryIndicator.vue';
import SatellitesNumberIndicator from '@/components/SatellitesNumberIndicator.vue';

//stores
import { useReportStore } from '@/stores/report/reportStore'
import { storeToRefs } from 'pinia'

const currentTime = new Date()
const selectedTime = ref((currentTime.getHours()).toString())
const startDate = ref(new Date().toLocaleDateString('en-CA'))
const endDate = ref(new Date().toLocaleDateString('en-CA'))
const startTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))
const endTime = ref(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }))

async function setTimeFilter() {
  switch (selectedTime.value) {
    case "0":
      startTime.value = "00:00"
      endTime.value = "01:00"
      break;
    case "1":
      startTime.value = "01:00"
      endTime.value = "02:00"
      break;
    case "2":
      startTime.value = "02:00"
      endTime.value = "03:00"
      break;
    case "3":
      startTime.value = "03:00"
      endTime.value = "04:00"
      break;
    case "4":
      startTime.value = "04:00"
      endTime.value = "05:00"
      break;
    case "5":
      startTime.value = "05:00"
      endTime.value = "06:00"
      break;
    case "6":
      startTime.value = "06:00"
      endTime.value = "07:00"
      break;
    case "7":
      startTime.value = "07:00"
      endTime.value = "08:00"
      break;
    case "8":
      startTime.value = "08:00"
      endTime.value = "09:00"
      break;
    case "9":
      startTime.value = "09:00"
      endTime.value = "10:00"
      break;
    case "10":
      startTime.value = "10:00"
      endTime.value = "11:00"
      break;
    case "11":
      startTime.value = "11:00"
      endTime.value = "12:00"
      break;
    case "12":
      startTime.value = "12:00"
      endTime.value = "13:00"
      break;
    case "13":
      startTime.value = "13:00"
      endTime.value = "14:00"
      break;
    case "14":
      startTime.value = "14:00"
      endTime.value = "15:00"
      break;
    case "15":
      startTime.value = "15:00"
      endTime.value = "16:00"
      break;
    case "16":
      startTime.value = "16:00"
      endTime.value = "17:00"
      break;
    case "17":
      startTime.value = "17:00"
      endTime.value = "18:00"
      break;
    case "18":
      startTime.value = "18:00"
      endTime.value = "19:00"
      break;
    case "19":
      startTime.value = "19:00"
      endTime.value = "20:00"
      break;
    case "20":
      startTime.value = "20:00"
      endTime.value = "21:00"
      break;
    case "21":
      startTime.value = "21:00"
      endTime.value = "22:00"
      break;
    case "22":
      startTime.value = "22:00"
      endTime.value = "23:00"
      break;
    case "23":
      startTime.value = "23:00"
      endTime.value = "24:00"
      break;
  }
}

const reportStore = useReportStore()
const { devicesReport, getDevicesReportIsLoading } = storeToRefs(useReportStore())
let header = []

const items = ref([])

onBeforeMount(async () => {
  setFlexibleHeader()
  loadDevicesReport()
})

async function loadDevicesReport() {
  await setTimeFilter()
  const queryParams = {}
  queryParams.startTime = new Date(startDate.value + 'T' + startTime.value).toISOString()
  queryParams.endTime = new Date(endDate.value + 'T' + endTime.value).toISOString()
  queryParams.imei = props.deviceImei
  await reportStore.getDevicesReport(queryParams)
}

const closeNotification = () => {
  modalActive.value = false
}

const props = defineProps(['deviceImei', 'deviceType'])
const emits = defineEmits(['devicesRealtime'])
function devicesRealtime() {
  emits('devicesRealtime')
}


function setFlexibleHeader() {
  header = []
  switch (props.deviceType) {
    case 'ADAS':
      header.push(
        { text: "Time", value: "_time", sortable:true },
        { text: "GSM Signal", value: "gsmSignal", sortable:true },
        { text: "GPS Status", value: "gpsStatus", sortable:true },
        { text: "GNSS Status", value: "gnssStatus", sortable:true },
        { text: "SD Card Status", value: "sdCardStatus", sortable:true },
        { text: "Satellites Qty.", value: "satellites", sortable:true },
        { text: "Battery Percentage", value: "batteryPercentage", sortable:true },
        { text: "Record Status", value: "record", sortable:true },
        { text: "ADAS State", value: "adasState", sortable:true },
        { text: "ADAS Error Code", value: "adasErrorCode", sortable:true },
        { text: "Coordinate", value: "coordinate" },
      )
      break;
    case 'DSM':
      header.push(
        { text: "Time", value: "_time", sortable:true },
        { text: "Active Driver Name", value: "activeDriverName", sortable:true },
        { text: "GSM Signal", value: "gsmSignal", sortable:true },
        { text: "GPS Status", value: "gpsStatus", sortable:true },
        { text: "GNSS Status", value: "gnssStatus", sortable:true },
        { text: "Speed", value: "speed", sortable:true },
        { text: "Satellites Qty.", value: "satellites", sortable:true },
        { text: "Battery Percentage", value: "batteryPercentage", sortable:true },
        { text: "Record Status", value: "recordingStatus", sortable:true },
        { text: "DSM State", value: "dsmState", sortable:true },
        { text: "DSM Error Code", value: "dsmErrorCode", sortable:true },
        { text: "Coordinate", value: "coordinate" },
      )
      break;
    case 'MDVR':
      header.push(
        { text: "Time", value: "_time", sortable:true },
        { text: "Fuel", value: "fuel", sortable:true },
        { text: "Speed", value: "speed", sortable:true },
        { text: "Course", value: "course", sortable:true },
        { text: "Deviation", value: "deviation", sortable:true },
        { text: "Parking Time", value: "parkingTime", sortable:true },
        { text: "Audio Type", value: "audioType", sortable:true },
        { text: "Factory Subtype", value: "factorySubtype", sortable:true },
        { text: "Hard Type", value: "hardType", sortable:true },
        { text: "Network Type", value: "networkType", sortable:true },
        { text: "Satellites Qty.", value: "satellites", sortable:true },
        { text: "Coordinate", value: "coordinate" },
      )
      break;
  }
}

</script>

<style scoped>
.content {
  @apply w-full h-full relative ml-[47px] pt-[50px]
}

.device-container {
  @apply flex flex-col w-full
}

.title {
  @apply text-[24px] flex justify-start items-center text-black opacity-80 mb-6
}

.card-wrapper {
  @apply grid grid-cols-1 gap-5
}

.card {
  /* box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25); */
  @apply rounded-md bg-white cursor-pointer flex flex-col p-6 text-left border gap-2
}

.card:hover {
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
}

.red-chip {
  @apply bg-[#C21629]
}

.grey-chip {
  @apply bg-[#CCD1D5]
}

.green-chip {
  @apply bg-[#34C759]
}

.yellow-chip {
  @apply bg-[#FFC700]
}

.customize-table {
  --easy-table-border: 1px solid #EBEBED;
  --easy-table-header-font-size: 12px;
  --easy-table-header-background-color: transparent;
  --easy-table-header-font-color: #6E6E78;
  --easy-table-header-height: 40px;

  --easy-table-body-row-font-size: 12px;
  --easy-table-body-font-color: #3A3A3E;
  --easy-table-body-row-height: 46px;

  --easy-table-footer-font-size: 12px;
  --easy-table-footer-height: 40px;
  --easy-table-footer-font-color: #6E6E78;
  border-collapse: collapse;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: auto;

}

.back-btn {
  @apply self-start flex p-3 text-sm font-medium bg-transparent w-fit items-center gap-4 border-solid border-t border-x rounded-t-[8px] border-[#EBEBED]
}

.back-btn:hover {
  @apply bg-[#93C76A] text-white
}

.arrow {
  @apply stroke-black
}

.back-btn:hover .arrow {
  @apply stroke-white
}
</style>