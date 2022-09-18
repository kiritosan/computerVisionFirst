import { doubleThresholds, nms, getImageData, pixelTraversal, matrixTraversal, grayScale, drawImageFromArray, convolution, sobel, arrayDivide, expandToImageDataArray, normalization, gaussianFilter } from './lib/util.js'
/* import { themeChange } from 'theme-change' */
/* themeChange() */

const canvasOriginal = document.getElementById('myCanvas') // canvas画布
const canvasGray = document.getElementById('myCanvasGray') // canvas画布
const canvasEdgeX = document.getElementById('myCanvasEdgeX') // canvas画布
const canvasEdgeY = document.getElementById('myCanvasEdgeY') // canvas画布
const canvasEdgeTotal = document.getElementById('myCanvasEdgeTotal') // canvas画布
const canvasGaussian = document.getElementById('myCanvasGaussian') // canvas画布
const canvasEdgeXS = document.getElementById('myCanvasEdgeXS') // canvas画布
const canvasEdgeYS = document.getElementById('myCanvasEdgeYS') // canvas画布
const canvasEdgeTotalS = document.getElementById('myCanvasEdgeTotalS') // canvas画布
const canvasNMS = document.getElementById('myCanvasNMS') // canvas画布
const canvasLast = document.getElementById('myCanvasLast') // canvas画布
const sobelButton = document.getElementById('sobelButton') // canvas画布
const cannyButton = document.getElementById('cannyButton') // canvas画布

/* 这里用./提示的文件路径是根据当前来的，但是index.html引入后.变成的index.html所在的目录造成了路径的变化 */
getImageData(canvasOriginal, './src/assets/test.jpg').then((data) => {
  console.log('ImageDataArray:', data) // 打印输出像素数据
  /* pixelTraversal(data); */
  /* matrixTraversal(data) */
  const imgGrayArray = grayScale(data)
  const imgGrayDataArray = expandToImageDataArray(imgGrayArray)

  drawImageFromArray(canvasGray, imgGrayDataArray)
  /* const kernel = [-1, 0, -1, -2, 0, +2, -1, 0, +1] */
  /* convolution(imgGrayDataArray, 1, 2, kernel) */
  const { gradXArray, gradYArray, gradTotalArray, thetaArray } = sobel(imgGrayDataArray, canvasGray.width, canvasGray.height)

  /* 归一化处理 */
  const normalGradXArray = normalization(gradXArray)
  const normalGradYArray = normalization(gradYArray)
  const normalGradTotalArray = normalization(gradTotalArray)

  const gradImageXArray = expandToImageDataArray(normalGradXArray)
  const gradImageYArray = expandToImageDataArray(normalGradYArray)
  const gradImageTotalArray = expandToImageDataArray(normalGradTotalArray)

  drawImageFromArray(canvasEdgeX, gradImageXArray)
  drawImageFromArray(canvasEdgeY, gradImageYArray)
  drawImageFromArray(canvasEdgeTotal, gradImageTotalArray)

  console.warn('----------------sobel over----------------')

  /* canny 2*/
  const imgGrayGaussianArray = gaussianFilter(imgGrayDataArray, 5, 1)
  const imgGrayGaussianDataArray = expandToImageDataArray(imgGrayGaussianArray)
  drawImageFromArray(canvasGaussian, imgGrayGaussianDataArray)

  /* canny 3 */
  const { gradXArray: gradXArrayS, gradYArray: gradYArrayS, thetaArray: thetaArrayS, gradTotalArray: gradTotalArrayS } = sobel(imgGrayGaussianDataArray, 296, 296)

  /* 归一化处理 */
  const normalGradXArrayS = normalization(gradXArrayS)
  const normalGradYArrayS = normalization(gradYArrayS)
  const normalGradTotalArrayS = normalization(gradTotalArrayS)

  const gradImageXArrayS = expandToImageDataArray(normalGradXArrayS)
  const gradImageYArrayS = expandToImageDataArray(normalGradYArrayS)
  const gradImageTotalArrayS = expandToImageDataArray(normalGradTotalArrayS)

  drawImageFromArray(canvasEdgeXS, gradImageXArrayS)
  drawImageFromArray(canvasEdgeYS, gradImageYArrayS)
  drawImageFromArray(canvasEdgeTotalS, gradImageTotalArrayS)

  /* 高斯滤波后的图像的梯度 */
  /* 用归一化之前的梯度值参与计算 */
  const gradNMSArray = nms(gradTotalArrayS, gradXArrayS, gradYArrayS)
  window.data = gradNMSArray
  const gradNMSDataArray = expandToImageDataArray(gradNMSArray)

  drawImageFromArray(canvasNMS, gradNMSDataArray)

  const gradNMSDTArray = doubleThresholds(gradNMSArray)
  console.log('gradNMSDTArray', gradNMSDTArray)
  window.d = gradNMSDTArray
  /* DT后的数组值非零即一，所以要能显示出来需要乘以255 */
  const gradnmsDTDataArray = expandToImageDataArray(gradNMSDTArray.map((v) => v * 255))

  drawImageFromArray(canvasLast, gradnmsDTDataArray)
})
