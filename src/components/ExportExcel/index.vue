<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
/* 封装导出数据到excel功能 */
/**
 * params: mandatory 协议请求参数
 * headers: mandatory excel导出文件头
 * totalNumber: mandatory 总的条数
 *
 * fileName: optional 文件名称
 * pageSize: optional 每页大小
 *
 * sendRequest: mandatory 发送请求函数
 * convertData: optional 请求数据转换函数
 *
 * 通知函数
 * onStart(): 开始下载函数
 * onProgress(index): 第几个文件下载结束通知
 * onFinish(isSuccess): 下载结束，参数true: 成功; false: 失败
 */
//对外通知函数
const onStart = "onStart"
const onProgress = "onProgress"
const onFinish = "onFinish"

//导出数据时每页的大小
const EXPORT_PAGE_SIZE = 10000
const TAG = "ExportExcel"

export default {
  name: 'ExportExcel',
  props: {
    eParams: {},
    eHeaders: {
      type: Array,
      default: ()  => []
    },
    eTotalNumber: {
      type: Number,
      default: 0
    },

    eFileName: null,
    ePageSize: {
      type: Number,
      default: EXPORT_PAGE_SIZE
    },
    sendRequest: {},
    convertData: {},
  },
  data() {
    return {
      isExporting: false,
      pageCount: 0,
      totalPageCnt: 0,
      exportSuccess: true,
      curPage: 1,
      headers: this.eHeaders,
      totalNumber: this.eTotalNumber,
      fileName: this.fileName,
      pageSize: this.ePageSize,
      params: this.eParams
    }
  },
  methods: {
    updateExportState() {
      if(this.pageCount > 0) {
        this.pageCount--
        console.log(TAG, this.pageCount)
        this.$emit(onProgress, this.totalPageCnt - this.pageCount)
      }
      if(this.pageCount <=0 ) {
        console.log(TAG, "onFinish")
        this.$emit(onFinish, this.exportSuccess)
        this.isExporting = false;
      }
    },
    //保存文件
    saveDataToExcel(data, saveFileName) {
      console.log(TAG, "saveDataToExcel", saveFileName)
      import('@/vendor/Export2Excel').then(excel => {
            const jsonData = this.convertData(data)
            excel.export_json_to_excel({
            header: this.headers,
            data: jsonData,
            filename: saveFileName,
          })
          this.updateExportState()
        })
    },
    startExport(data) {
      if(this.isExporting) {
        console.log(TAG, "repulicate click export button")
        return
      }
      this.headers = this.eHeaders
      this.params = this.eParams
      this.fileName = this.eFileName
      this.pageSize = this.ePageSize
      this.totalNumber = this.eTotalNumber

      if(data.headers)
        this.headers = data.headers
      if(data.params)
        this.params = data.params
      if(data.totalNumber && data.totalNumber > 0)
        this.totalNum = data.totalNumber
      if(data.fileName)
        this.fileName = data.fileName
      if(data.pageSize && data.pageSize > 0)
        this.pageSize = data.pageSize

      console.log(TAG + " totalSize=" + this.totalNumber)
      this.exportSuccess = true;
      this.isExporting = true;
      this.curPage = 1
      let fileName = this.fileName;
      if(!fileName) {
        fileName = this.$util.formatTime(new Date().getTime(), 'YYYYMMDDHHmmss')
      }
      this.$emit(onStart)
      if(this.totalNumber) {
        this.downloadAllPage(fileName)
      } else {
        this.downloadAllPageWithoutTotalNum(fileName)
      }
    },
    downloadAllPageWithoutTotalNum(fileName) {
      //请求第一页
      console.log(TAG, "getFirstPage")
      this.page
      const p = Object.assign({ pageNum: this.curPage, pageSize: this.pageSize}, this.params)

      let saveFileName = fileName
      this.sendRequest(p).then(response => {
        this.totalNumber = parseInt(response.data.totalElements, 10) || 1
        if(this.totalNumber > this.pageSize) {
          saveFileName = fileName + "_part1"
          this.curPage = 2
        }
        console.log(TAG, saveFileName, " get data success")
        this.saveDataToExcel(response.data.data, saveFileName)
        this.downloadAllPage(fileName)
      }).catch(error => {
          console.log(TAG, JSON.stringify(error))
          this.exportSuccess = false
          this.updateExportState()
      })
    },
    downloadAllPage(fileName) {
      //根据totalNum分成几部分进行下载， 显示loading， 结束提示成功
      this.pageCount = parseInt((this.totalNumber + this.pageSize - 1)/this.pageSize)
      this.totalPageCnt = this.pageCount

      if(this.pageCount > 1)
        fileName = fileName + "_part"
      console.log(TAG, "total=" + this.totalNumber + " pageCount=" + this.pageCount)
      for(let pageIndex = this.curPage; pageIndex <= this.pageCount; pageIndex++) {
        let reqPageSize = this.totalNumber - (pageIndex - 1) * this.pageSize;
        if(reqPageSize > this.pageSize)
          reqPageSize = this.pageSize;
        const p = Object.assign({ pageNum: pageIndex, pageSize: reqPageSize}, this.reqParams())

        this.sendRequest(p).then(response => {
          console.log(TAG, fileName + pageIndex, " get data success")
            this.saveDataToExcel(response.data.data, fileName + pageIndex)
        }).catch(error => {
            console.log(TAG, JSON.stringify(error))
            this.exportSuccess = false
            this.updateExportState()
        })
      }
    }
  }
}
</script>
