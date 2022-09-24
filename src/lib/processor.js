import { renderTableData, expandToImageData, renderInsideDomFromDataObj, doubleThresholds, nms, grayScale, sobel, expandToImageDataArray, normalization, gaussianFilter } from './util.js'

function sobelProcessor(imgData) {
  console.warn('----------------sobel start----------------')
  /* 这里用./提示的文件路径是根据当前来的，但是index.html引入后.变成的index.html所在的目录造成了路径的变化 */
  console.log('ImageData:', imgData) // 打印输出像素数据
  /* pixelTraversal(imgData); */
  /* matrixTraversal(imgData) */
  const { imgGrayArray, width, height } = grayScale(imgData)
  const imgGrayDataArray = expandToImageDataArray(imgGrayArray)
  const imgGrayData = expandToImageData(imgGrayDataArray, width, height)

  renderInsideDomFromDataObj('renderContainerBelow', imgGrayData, '灰度处理')

  /* const kernel = [-1, 0, -1, -2, 0, +2, -1, 0, +1] */
  /* convolution(imgGrayDataArray, 1, 2, kernel) */
  // TODO 得到的是小一圈的
  const { gradXArray, gradYArray, gradTotalArray, thetaArray } = sobel(imgGrayData)

  /* 归一化处理 得到一值一组的数组 */
  const normalGradXArray = normalization(gradXArray)
  const normalGradYArray = normalization(gradYArray)
  const normalGradTotalArray = normalization(gradTotalArray)

  /* 扩展成ImageDataArray 得到四值一组的数组 */
  const gradXImageDataArray = expandToImageDataArray(normalGradXArray)
  const gradYImageDataArray = expandToImageDataArray(normalGradYArray)
  const gradTotalImageDataArray = expandToImageDataArray(normalGradTotalArray)

  const gradXImage = expandToImageData(gradXImageDataArray, width-2, height-2)
  const gradYImage = expandToImageData(gradYImageDataArray, width-2, height-2)
  const gradTotalImage = expandToImageData(gradTotalImageDataArray, width-2, height-2)

  // 处理数据并渲染成表格
  renderTableData('dataTable', gradXArray, gradYArray, gradTotalArray, thetaArray)

  // 渲染处理后的图片
  renderInsideDomFromDataObj('renderContainerBelow', gradXImage, 'X方向梯度')
  renderInsideDomFromDataObj('renderContainerBelow', gradYImage, 'Y方向梯度')
  renderInsideDomFromDataObj('renderContainerBelow', gradTotalImage, '幅值')

  console.warn('----------------sobel over----------------')

}

function cannyProcessor(imgData) {
  console.warn('----------------canny start----------------')
  console.log('ImageData:', imgData) // 打印输出像素数据

  const { imgGrayArray, width, height } = grayScale(imgData)
  const imgGrayDataArray = expandToImageDataArray(imgGrayArray)
  const imgGrayData = expandToImageData(imgGrayDataArray, width, height)

  renderInsideDomFromDataObj('renderContainerBelow', imgGrayData, '灰度处理')

  /* canny 2 */
  const imgGrayGaussianArray = gaussianFilter(imgGrayData, 5, 1)
  const imgGrayGaussianDataArray = expandToImageDataArray(imgGrayGaussianArray)
  // TODO 注意高斯模糊处理后少两圈
  const imgGrayGaussianData = expandToImageData(imgGrayGaussianDataArray, width-4,height-4)

  renderInsideDomFromDataObj('renderContainerBelow', imgGrayGaussianData, '高斯模糊')

  /* canny 3 */
  const { gradXArray: gradXArrayS, gradYArray: gradYArrayS, gradTotalArray: gradTotalArrayS, thetaArray: thetaArrayS } = sobel(imgGrayGaussianData)

  /* 归一化处理 */
  const normalGradXArrayS = normalization(gradXArrayS)
  const normalGradYArrayS = normalization(gradYArrayS)
  const normalGradTotalArrayS = normalization(gradTotalArrayS)

  const gradXImageDataArrayS = expandToImageDataArray(normalGradXArrayS)
  const gradYImageDataArrayS = expandToImageDataArray(normalGradYArrayS)
  const gradTotalImageDataArrayS = expandToImageDataArray(normalGradTotalArrayS)
  // 在之前减两圈基础上减一圈，共减三圈，宽高各减六
  const gradXImageS = expandToImageData(gradXImageDataArrayS, width-6, height-6)
  const gradYImageS = expandToImageData(gradYImageDataArrayS, width-6, height-6)
  const gradTotalImageS = expandToImageData(gradTotalImageDataArrayS, width-6, height-6)

  // 处理数据并渲染成表格
  renderTableData('dataTable', gradXArrayS, gradYArrayS, gradTotalArrayS, thetaArrayS)

  renderInsideDomFromDataObj('renderContainerBelow', gradXImageS, 'X方向梯度')
  renderInsideDomFromDataObj('renderContainerBelow', gradYImageS, 'Y方向梯度')
  renderInsideDomFromDataObj('renderContainerBelow', gradTotalImageS, '幅值')

  // canny 4
  /* 用归一化之前的梯度值参与计算 */
  const gradNMSArray = nms(gradTotalArrayS, gradXArrayS, gradYArrayS, width-6, height-6)
  window.data = gradNMSArray
  const gradNMSDataArray = expandToImageDataArray(gradNMSArray)
  // nms后再减一圈 高斯两圈 sobel一圈 nms一圈 一共四圈
  const gradNMSData = expandToImageData(gradNMSDataArray, width-8, height-8)
  renderInsideDomFromDataObj('renderContainerBelow', gradNMSData, '非极大值抑制')

  const gradNMSDTArray = doubleThresholds(gradNMSArray)
  console.log('gradNMSDTArray', gradNMSDTArray)
  /* DT后的数组值非零即一，所以要能显示出来需要乘以255 */
  const gradNMSDTDataArray = expandToImageDataArray(gradNMSDTArray.map((v) => v * 255))
  // DT实现的时候没有去掉边缘，所以不减边缘的像素
  const gradNMSDTData = expandToImageData(gradNMSDTDataArray, width-8, height-8)

  renderInsideDomFromDataObj('renderContainerBelow', gradNMSDTData, '双阈值检测与边缘连接')

  console.warn('----------------canny over----------------')
}

export { sobelProcessor, cannyProcessor }
