// #region IMPORTS
import { pic } from '/front/utils/pictureUrl.js'
import { doFetch } from '/front/utils/fetchPost.js'
// #endregion

// #region HELPERS
const fromFahrenheits = fahrenheit => {
  const celsius = (fahrenheit - 32) / 1.8
  return Math.round(celsius / 5) * 5
}


const fromCelsius = celsius => {
  const fahrenheit = (celsius * 1.8) + 32
  return Math.round(fahrenheit / 5) * 5
}

const identify = () => {
  return [...document.querySelector('#top').classList][1].slice(6)
}
// #endregion



const handleSubmit = async e => {
  e.preventDefault()

  const data = {}
  const form = e.target

  // #region MAIN DATA
    const lowCase = [
      'name',
      'cook',
      'season',
      'cuisine',
      'counter',
      'fridge',
      'freezer',
      'organization',
      'sub',
      'birthday',
      
    ]

    const capCase = [
      'site',
      'cuisine',
      'tag',
      'protein30',
      'audio',

    ]

    const multiples = [
      'category',
      'variant',
      'pair',
      'colleagues',
      'related',
      'substitute',
      'notes',

    ]


    if(document.querySelector('.modifyflash')) {
      capCase.push('name')
    }


    // if(document.querySelector('.modifycategory')) {
    //   multiples.shift()
    //   lowCase.push('category')
    // }


    lowCase.forEach(x => {
      if(form.querySelector(`#${x}`)?.value) {
        data[x] = form.querySelector(`#${x}`).value.toLowerCase()
      }
    })


    if(form.querySelector('#picture')) {
      data.picture = pic(form.querySelector('#picture').value)
      if(data.category == 'groceries' && data.picture.includes('items')) {
        data.picture = data.picture.replace('items', 'foods')
      }
    }


    capCase.forEach(x => {
      if(form.querySelector(`#${x}`)) {
        data[x] = form.querySelector(`#${x}`).value
      }
    })


    multiples.forEach(x => {
      data[x] = []
      const items = e.target.querySelectorAll(`#${x}`)
      items.forEach(i => {
        if(i.value) data[x].push(i.value)
      })
    })
  // #endregion

  // #region MISCELLANEOUS
    if(form.querySelector('#rotation')) {
      data.rotation = form.querySelector('#rotation').checked
    }

    const plex = ['myExperience', 'repeat']
    plex.forEach(p => {
      const fields = form.querySelectorAll(`input[name="${p}"]`)
      if(fields) {
        fields.forEach(x => {
          if(x.checked) data[p] = x.id
        })
      }
    })


    const conversion = document.querySelector('.conversion')
    if (conversion) {
      const quantity = conversion.querySelector('#cquantity').value
      const unit = conversion.querySelector('#cunit').value || 'ml'
      if (quantity) {
        data.conversion = {
          quantity,
          unit
        }
      }
    }

    data.keepFor = 0
    const keepFor = document.querySelectorAll('.keepFor div input')
    keepFor.forEach(x => {
      if (x.checked) {
        data.keepFor += Number(x.nextElementSibling.innerHTML)
      }
    })

    if (!data.keepFor) data.keepFor = 8
  // #endregion

  const stores = document.querySelectorAll('#storePlus')
  if (stores.length > 1) {
    data.stores = []
    for(let i = 1; i < stores.length; i++) {
      if (stores[i].querySelector('#storename')?.value) {
        const current = {
          name: stores[i].querySelector('#storename').value,
          address: stores[i].querySelector('#paddress').value,
          price: stores[i].querySelector('#price').value
        }
        if (Number(stores[i].querySelector('#pamount').value) || stores[i].querySelector('#punit').value) {
          current.amount = Number(stores[i].querySelector('#pamount').value) || 1
          current.unit = stores[i].querySelector('#punit').value || 'pcs'
        }
        data.stores.push(current)
      }
    }
  }

  data.bus = []

  // #region
  const location = document.querySelectorAll('#addressPlus')
  location.forEach(x => {
    const address = x.querySelector('#address').value
    const line = x.querySelector('#line').value
    const stop = x.querySelector('#stop').value

    if (address) {
      const current = {
        address,
        line,
        stop
      }
      data.bus.push(current)
    }
  })
  // #endregion

  // #region STEPS
    const steps = form.querySelectorAll('#positional')
    data.steps = []
    data.ingredients = []
    steps.forEach(x => {
      const step = {}
      step._id = x.childNodes[3].id.substring(4)
      step.name = x.querySelector('.stepName #stepName').value

      // #region TEMPERATURES
      const temps = x.querySelectorAll('.splitInHalf .right input')
      temps.forEach(x => {
        if(x.value.charAt(x.value.length - 1) == 'f' || x.value.charAt(x.value.length - 1) == 'F') {
          x.value = fromFahrenheits(Number(x.value.slice(0, -1)))
        }
        else if(x.value.charAt(x.value.length - 1) == 'c' || x.value.charAt(x.value.length - 1) == 'C') x.value = fromCelsius(Number(x.value.slice(0, -1)))
      })
          step.temperatureI = temps[1].value
          step.temperatureS = temps[0].value
      // #endregion

      step.stepNotes = x.querySelector('#stepNotes').value

      // #region DURATION
      step.duration = []
      const times = x.querySelectorAll('.stepTime .timeUnitWrapper')
      times.forEach(t => {
        if(step.duration.length <= 1) {
          const cur = {
            duration: t.querySelector('#duration').value
          }
          if(t.querySelector('.selectedUnit')) {
            cur.unit = t.querySelector('.selectedUnit').dataset.unit
          }
          if(step.duration.length == 1) {
            cur.max = true
          }

          step.duration.push(cur)
        }
      })
      // #endregion

      // #region ELEMENTS
      step.elements = []
      const elements = x.querySelectorAll('#substep')
      let previous
      elements.forEach(s => {
        const current = {}

        current.element = s.querySelector('#element').value
        current.elementRef = s.querySelector('#element').className
        if(s.querySelector('#element').className == 'Food') {
          if( previous !== 'remove') {
            
          // HELPER: cups are converted in the back/utils/sortData.js, cause you need "conversion" from the database, and this is front end js
          // convert oz to g = oz * 28.3495
          if(s.querySelectorAll('p input')[1].value == 'oz') {
            s.querySelectorAll('p input')[1].value = 'g'
            s.querySelectorAll('p input')[0].value = 30 * s.querySelectorAll('p input')[0].value
          } // convert foz to ml = oz * 29.5734
          if(s.querySelectorAll('p input')[1].value == 'foz') {
            s.querySelectorAll('p input')[1].value = 'ml'
            s.querySelectorAll('p input')[0].value = 30 * s.querySelectorAll('p input')[0].value
          }
          if(s.querySelectorAll('p input')[1].value == 'scoop') {
            s.querySelectorAll('p input')[1].value = 'g'
            s.querySelectorAll('p input')[0].value = 1.5 * s.querySelectorAll('p input')[0].value
          }
          //add to ingredients...
          if(s.querySelector('#element').value == 'butter' && s.querySelectorAll('p input')[1].value == 'tbsp') {
            // convert tablestpoons of butter to grams
            s.querySelectorAll('p input')[1].value = 'g'
            s.querySelectorAll('p input')[0].value = s.querySelectorAll('p input')[0].value * 15
          }
          if (s.querySelectorAll('p input')[1].value == 'tbsp') {

          }
          const ingr = {
            ingredient: s.querySelector('#element').value,
            amount: s.querySelectorAll('p input')[0].value,
            unit: s.querySelectorAll('p input')[1].value,
            group: x.querySelector('.stepName #stepName').value
          }
          if(previous == 'optional' || previous == 'alternatively' || previous == 'remove') {
            ingr.required = false
          } else {
            ingr.required = true
          }
          data.ingredients.push(ingr)
        
          }
        }
        previous = s.querySelector('#element').value
        step.elements.push(current)
      })
      // #endregion


      if(step.name || step.elements[0].element || step.stepNotes) {
        data.steps.push(step)
      }
    })
  // #endregion

  // #region
  if (document.querySelector('#time')) {
    const time = document.querySelector('#time').value
    const date = document.querySelector('#date').value

    data.minder = {
      type: 'general',
      time: time,
      date: date,
      repeats: data.repeat,
      active: true,
      audio: `/audio/${data.audio}`,
    }

    
    const fullDateStr = `${date}T${time}:00`
    const fullDate = new Date(fullDateStr)
    data.minder.targetDate = fullDate
    data.minder.defaultSnooze = document.querySelector('#snooze').value
  }
  
  // #endregion

  console.info(data)
  //doFetch(data)

  const url = window.location.pathname
  const json = await doFetch(data, url)
  const dom = identify()
  window.location = `/show/${dom}/${json._id}`
}

export default (() => {
  const submit = (() => {
    const form = document.querySelector('form')
    form.addEventListener('submit', handleSubmit)
  })()
})()