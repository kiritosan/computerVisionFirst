import { getImageData, isValidURL, awaitWrap, renderInsideDomFromDataObj } from './lib/util.js'
import { sobelProcessor, cannyProcessor } from './lib/processor.js'

themeChange()

const sobelButton = document.getElementById('sobelButton')
const cannyButton = document.getElementById('cannyButton')
const getRandomButton = document.getElementById('getRandomButton')
const link = document.getElementById('link')

link.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getButton.click()
  }
})

getRandomButton.addEventListener('click', async () => {
  getRandomButton.disabled = true
  setTimeout(()=>{
      getRandomButton.disabled = false
  }, 2000)
  const [err, res] = await awaitWrap(fetch('https://source.unsplash.com/random/300*150'))
  if (err) {
    console.log(err)
  } else {
    link.value = res.url
    getButton.click()
    getButton.disabled = true
  }
})

getButton.addEventListener('click', async function (e) {
    getButton.disabled = true
    setTimeout(()=>{
        getButton.disabled = false
    }, 10000)
    document.querySelector('[id=control]').classList.replace('mt-10', 'mt-20')
    document.querySelector('[id=renderContainerAbove]').style.display = 'none'
    document.querySelector('[id=dataTableContainer]').style.display = 'none'
    document.querySelector('#failure').style.display = 'none'
    document.querySelector('#success').style.display = 'none'

    if (!isValidURL(link.value)) {
        alert('invalid url')
        getButton.disabled = false
        return
    }

    try {
        const imgData = await getImageData(link.value)
        window.imgData = imgData
    } catch (e) {
        document.querySelector('#failure').style.display = ''
        console.log(e)
    }

    document.querySelector('#success').style.display = ''
    document.querySelector('[id=control]').classList.replace('mt-20', 'mt-10')
    console.log('imgData get successfully', imgData)

    document.querySelector('[id= dataTable]').innerHTML = ''
    document.querySelector('[id= dataTable]').classList.remove('handsontable', 'htRowHeaders', 'htColumnHeaders')
    document.querySelector('[id= renderContainerAbove]').innerHTML = ''
    document.querySelector('[id= renderContainerBelow]').innerHTML = ''
    renderInsideDomFromDataObj('renderContainerBelow', window.imgData, '原图')
    getButton.disabled = false
})

sobelButton.addEventListener('click', function(e) {
  document.querySelector('[id= renderContainerAbove]').style.display = ''
  document.querySelector('[id= dataTableContainer]').style.display = ''

  if (window.imgData) {
    sobelButton.disabled = true
    document.querySelector('[id=renderContainerAbove]').innerHTML = ''
    sobelProcessor(window.imgData)
    sobelButton.disabled = false
  }
})

cannyButton.addEventListener('click', function(e) {
  document.querySelector('[id= renderContainerAbove]').style.display = ''
  document.querySelector('[id= dataTableContainer]').style.display = ''

  if (window.imgData) {
    cannyButton.disabled = true
    document.querySelector('[id=renderContainerAbove]').innerHTML = ''
    cannyProcessor(window.imgData)
    cannyButton.disabled = false
  }
})
