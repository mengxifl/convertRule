<template>
  <v-main class="d-flex align-center">
    <v-container class="border border-s-lg elevation-2 flex-column ma-2" fluid>
      <v-row>
        <v-col>
          convert rule of google mail 
        </v-col>
      </v-row>
      <v-row >
        <v-col>
          <v-divider class="border-opacity-100" color="grey-lighten" :thickness="2" />
        </v-col>
      </v-row>
      <v-row> <v-col> upload file: {{ upLoadFileName.name }} </v-col> </v-row>
      <v-row >
        <v-col>
          <v-divider class="border-opacity-100" color="grey-lighten-3" :thickness="2" />
        </v-col>
      </v-row>
      <v-row> <v-col> Convert Report:  </v-col> </v-row>
      <v-row>
        <v-col>
          <v-table height="400px" >
            <thead>
              <tr>
                <th class="text-left">
                  google rule
                </th>
                <th class="text-left">
                  feishu rule
                </th>
                <th class="text-left">
                  can't convert rule
                </th>
                <th class="text-left">
                  result
                </th>
                <!-- <th class="text-left">
                  原因
                </th> -->
                <th class="text-left">
                  suggest
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableContent"
                :key="item.googleRule"
              >
                <td class="pa-1" v-html="item.googleRule"></td>
                <td class="pa-1" v-html="item.feishuRule"></td>
                <td class="pa-1" v-html="item.different"></td>
                <td class="pa-1" v-html="item.result"></td>
                <!-- <td class="pa-1" v-html="item.reason"></td> -->
                <td class="pa-1" v-html="item.suggestion"></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
      <v-row >
        <v-col>
          <v-divider class="border-opacity-100" color="grey-lighten" :thickness="2"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn class="rounded mr-2 bg-purple-darken-4" @click="handleClickUpload">upload</v-btn>
        </v-col>
        <v-col class="d-flex align-self-center justify-end">
          <v-btn class="rounded mr-2 bg-purple-darken-4" @click="handleClickDownLoad" v-show="isShowDownload">Down load import file</v-btn>
          <v-btn class="rounded mr-2 bg-purple-darken-4" @click="handleClickDownLoadReport" v-show="isShowDownload">Down load report</v-btn>
        </v-col>
      </v-row>
      <input
        type="file"
        id="fileInput"
        @change="handleFileUpload"
        v-show="false"
        accept=".xml"
      >
    </v-container>
  </v-main>
</template>

<script>

import { ref } from 'vue';
import ExcelJS from 'exceljs';
import { convertFileContent, convertMain } from './process.js'
export default {
  setup() {
    const upLoadFileName    = ref( {name: "have't upload any file"} )
    const convertedContent  = ref( '' )
    const isShowDownload    = ref( false )
    const convertRuleReadme = ref( '' )
    const tableContent      = ref( {} )
    const report            = ref( {} )


    const handleClickUpload = ( event ) =>  { document.getElementById('fileInput').click() }

    const handleFileUpload = ( event ) => {
      // console.dir( event )
      const file = event.target.files[0];
      if (file && file.type !== 'text/xml') {
        alert('Please uploda a xml file');
        return
      }
      upLoadFileName.value   = file
      convertFileContent(
        file,
        ( newValue )=>{
          convertedContent.value = newValue.convertFile
          tableContent.value     = newValue.table
          report.value           = newValue.report
        }
      )
      isShowDownload.value   = true
    }


    const handleClickDownLoad = ( event ) =>  {
      // console.dir( convertedContent )
      if( convertedContent.value === '' ) { alert( `converting wait one min` ); return }
      // console.dir( upLoadFileName.value )
      let filename = ''
      const lastDotIndex = upLoadFileName.value.name.lastIndexOf('.');
      if (lastDotIndex === -1) {  filename = upLoadFileName.value.name + `-new` }
      if (lastDotIndex !== -1) {
        filename = upLoadFileName.value.name.substring(0, lastDotIndex) + `-new.` + upLoadFileName.value.name.substring(lastDotIndex + 1)
      }
      const blob = new Blob([convertedContent.value], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      // console.dir( filename )
      // filename = upLoadFileName.value.name.substring(0, lastDotIndex);
    }
    

    const handleClickDownLoadReport = async ( event ) => {
      // console.dir( event )
      // console.dir( report.value.xlsx )
      const buffer = await report.value.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return {
      handleClickUpload,
      handleFileUpload,
      handleClickDownLoadReport,
      upLoadFileName,
      convertedContent,
      isShowDownload,
      handleClickDownLoad,
      convertRuleReadme,
      tableContent,
      report,
    }
  }
}
</script>