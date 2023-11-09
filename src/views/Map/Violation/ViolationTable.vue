<template>


  <div class="px-[30px] py-[57px]">
    <div class="table-wrap">
      <div class="table-header">
        <h1 class="title">Violation Table</h1>
        <h1>Last Check: <span class="font-semibold pl-4">2023 / 09 / 10 23:44:28</span></h1>
      </div>
      <EasyDataTable
                :rows-per-page="10"
                table-class-name="customize-table"
                :headers="header"
                :items="dummyData"
                theme-color="#1363df"        
                >
              </EasyDataTable>
    </div> 
  </div>    
  </template>
    
  <script setup>

  const header = [
    { text: "No", value: "no" },
    { text: "Vehicle", value: "vehicle",sortable: true },
    { text: "Position", value: "position",sortable: true },
    { text: "Speed (KpH)", value: "speed", sortable: true },
    { text: "Violation", value: "violation", sortable: true },
    { text: "Time", value: "time" ,sortable: true},
  ]
  const dummyData = [
  { no: '1', vehicle: 'DOMO', position: 'KM 20', speed: 40, violation: 'Phone Alarm', time: '12-10-2023 10:44:02' },
  { no: '2', vehicle: 'ABC Car', position: 'KM 15', speed: 35, violation: 'Speeding', time: '12-10-2023 10:45:02' },
  { no: '3', vehicle: 'XYZ Truck', position: 'KM 10', speed: 50, violation: 'Seatbelt', time: '12-10-2023 10:46:02' },
  { no: '4', vehicle: 'Blue Van', position: 'KM 5', speed: 45, violation: 'Phone Alarm', time: '12-10-2023 10:47:02' },
  { no: '5', vehicle: 'Green Bike', position: 'KM 8', speed: 55, violation: 'Speeding', time: '12-10-2023 10:48:02' },
  { no: '6', vehicle: 'Red Car', position: 'KM 12', speed: 60, violation: 'Signal Violation', time: '12-10-2023 10:49:02' },
  { no: '7', vehicle: 'Yellow Bus', position: 'KM 19', speed: 38, violation: 'Seatbelt', time: '12-10-2023 10:50:02' },
  { no: '8', vehicle: 'Silver SUV', position: 'KM 22', speed: 42, violation: 'Phone Alarm', time: '12-10-2023 10:51:02' },
  { no: '9', vehicle: 'Black Truck', position: 'KM 26', speed: 47, violation: 'Speeding', time: '12-10-2023 10:52:02' },
  { no: '10', vehicle: 'White Car', position: 'KM 29', speed: 30, violation: 'Seatbelt', time: '12-10-2023 10:53:02' },
  { no: '11', vehicle: 'Orange Bike', position: 'KM 27', speed: 52, violation: 'Signal Violation', time: '12-10-2023 10:54:02' },
  { no: '12', vehicle: 'Purple Car', position: 'KM 18', speed: 43, violation: 'Phone Alarm', time: '12-10-2023 10:55:02' },
  { no: '13', vehicle: 'Gray SUV', position: 'KM 13', speed: 57, violation: 'Speeding', time: '12-10-2023 10:56:02' },
  { no: '14', vehicle: 'Brown Van', position: 'KM 7', speed: 34, violation: 'Seatbelt', time: '12-10-2023 10:57:02' },
  { no: '15', vehicle: 'Teal Car', position: 'KM 14', speed: 46, violation: 'Phone Alarm', time: '12-10-2023 10:58:02' },
  { no: '16', vehicle: 'Magenta Bike', position: 'KM 21', speed: 51, violation: 'Signal Violation', time: '12-10-2023 10:59:02' },
  { no: '17', vehicle: 'Cyan Truck', position: 'KM 24', speed: 39, violation: 'Seatbelt', time: '12-10-2023 11:00:02' },
  { no: '18', vehicle: 'Lime Car', position: 'KM 11', speed: 49, violation: 'Phone Alarm', time: '12-10-2023 11:01:02' },
  { no: '19', vehicle: 'Indigo SUV', position: 'KM 17', speed: 44, violation: 'Speeding', time: '12-10-2023 11:02:02' },
  { no: '20', vehicle: 'Violet Van', position: 'KM 23', speed: 37, violation: 'Signal Violation', time: '12-10-2023 11:03:02' }
];
    
  </script>
    
  <style scoped>
  .title {
    @apply
      text-[24px] font-medium flex justify-start items-center text-[#353535]
  }
  .table-wrap {
    @apply
      overflow-auto sm:overflow-visible
  }
  .table-header {
    @apply
    flex flex-row w-full justify-between mb-6
  }
  /* .search-wrapper {
    @apply
      w-[280px] h-[40px]
  } */
  .operation {
    @apply flex gap-4
  }
  
  .customize-table {
    --easy-table-border:	1px solid #EBEBED;	
    --easy-table-header-font-size: 14px;
    --easy-table-header-background-color: transparent;
    --easy-table-header-font-color:	#6E6E78;
    --easy-table-header-height:	40px;
  
    --easy-table-body-row-font-size:	14px;
    --easy-table-body-font-color:	#3A3A3E;
    --easy-table-body-row-height:	46px;
  
    --easy-table-footer-font-size:	12px;
    --easy-table-footer-height:	40px;
    --easy-table-footer-font-color:	#6E6E78;
    border-collapse: collapse;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: hidden;
  }
  
    </style>