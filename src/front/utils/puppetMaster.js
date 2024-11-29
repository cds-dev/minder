import { doFetch } from '/front/utils/fetchPost.js'


const getDom = () => {
  const index = document.URL.split('/').indexOf('add')
  const dom = document.URL.split('/')[index + 1]
  return dom
}


const picName = e => {
  const pic = document.querySelector('#picture')
  if(!pic.value) {
    const name = document.querySelector('#name')
    if(name.value.includes('* ')) {
      pic.value = name.value.replace('* ', '').replaceAll(' ', '-')
    } else {
      pic.value = name.value.replaceAll(' ', '-')
    }
    pic.value = pic.value.replace('-|-test-kitchen', '')
    pic.value = pic.value.replace('-|-you-suck-at-cooking', '')
    pic.value = pic.value.replace('-|-giallo-zafferano', '')
    pic.value = pic.value.replace('-|-japanese-cooking-101', '')
    pic.value = pic.value.replace('-|-epicurious', '')
  }
}


const handleBlog = data => {
  const name = document.querySelector('#name')
  if (!name.value) name.value = `* ${data.title.toLowerCase()} | blog`

  name.addEventListener('blur', picName)

  // const pic = document.querySelector('#picture')
  // pic.value = `${data.title.toLowerCase().replaceAll(' ', '-')}`
  // if (data.ingredients) {
  //   data.ingredients.forEach(x => console.info(x))
  // }
}


const handleYoutube = data => {
  const name = document.querySelector('#name')
  console.info(data.ch)
  if (!name.value) {
    let startingName = data.name.toLowerCase()

    // #region GARBAGE
    const garbage = [' | akis petretzikis', 'from scratch ', 'como hacer ', 'spanish ', 'greatest ', 'of all time ', 'of your life ', 'best ', 'how to ', 'heartwarming ', 'the ', 'ultimate ', ' chef sanjyot keer', 'laura vitale\'s ','praktična žena – ', '- by laura vitale', '🍌', 'healthy ', '- you suck at cooking (episode ', ' | chef ranveer', 'ricetta', ' saporita', 'semplicissima', ' | next level kitchen', '🧅', '🥚', '🍕', '- youtube', ' | marion\'s kitchen', ' chef ranveer brar', ' | cooking with kurt', 'quick & easy', 'easy & quick', 'easy', 'quick', 'recipe', 'perfect', 'the best', 'how to make ', 'pro chef reacts.. ', '!', '#chinesefood', '#cooking', '#shorts', '#foodlover', 'amazing ', '| jamie oliver ', 'tasty ', '🍆', '😍', '💜', ' | food wishes', '#vegans', '#vegan', 'vegans', 'vegan', '#vegetarian', '#dessert', ' - food wishes', ' | chef ranveer brar', '🧡', '🌞', '😎', '😉', '🤤', '🍫', ' | marion’s kitchen', ':', ' cremosi e saporiti', '🥰', '🍅', '🌿', ' | julia at home', ' like an italian', '🐟', ' | cooking at home', ' | kqed', 'italian chef ', '💥', '💛', '😋', 'one pan ', '💚', '🧀', '✨', 'chef wang teaches you ', '"', '"', ',', ' | weeknighting', ' | friday night feast', '🍊', '🥕', '🐓', '🌾', ' | passport kitchen', ' | epicurious', '🥐', '💖', '🎄', ' - noriko\'s kitchen', ' - japanese cooking 101', '💯', '🔝', '🤍', '🎭', ' | livestream w/ anna olson', '🍞', ' - yuko\'s kitchen', 'garden answer','🥔', '🥓', ' | downshiftology', '🍗', '🥖', '💘', ' | food with chetna', '💙', '🥗', '🌊', 'martha stewart', '🥢', '🍚', ' | jamie oliver\'s meat free meals', ' by laura vitale', ' martha\'s cooking school | ', 'delicious ', 'jacques pépin\'s ', 'ever ', 'easiest ', ' | greekcuisine', ' | live w/ anna olson']
    // #endregion

    startingName = startingName.replaceAll('...', ' | ')

    garbage.forEach(x => {
      startingName = startingName.replaceAll(x, '')
    })
    if (startingName.includes('gluten free')) {
      startingName = startingName.replace('gluten free', 'gf')
    }
    if (startingName.includes('gluten-free')) {
      startingName = startingName.replace('gluten-free', 'gf')
    }
    startingName = startingName.trim()
    startingName = startingName.replaceAll('  ', ' ')
    startingName = startingName.replaceAll(' || ', ' | ')


    name.value = `* ${startingName}`
  }

  const cook = document.querySelector('#cook')
  const cuisine = document.querySelector('#cuisine')
  if(!cook.value) {
    switch (data.ch) {
      case 'Aaron and Claire':
        cook.value = 'aaron huh'
        cuisine.value = 'Korean'
        break
      case `Akis Petretzikis`:
        cook.value = 'akis petretzikis'
        break
      case `America's Test Kitchen`:
        name.value = `${name.value} | test kitchen`
        cuisine.value = 'American'
        break
      case `Autumn Bates`:
        cook.value = `autumn bates`
        cuisine.value = 'American'
        break
      case `Azlin Bloor`:
        cook.value = 'azlin bloor'
        break
      case 'Bernd Zehner':
        cook.value = 'bernd zehner'
        break
      case 'Bigger Bolder Baking':
        cook.value = 'gemma stafford'
        break
      case 'Bigger Bolder Baking with Gemma Stafford':
        cook.value = 'gemma stafford'
        break
      case 'Brian Lagerstrom ':
        cook.value = 'brian lagerstrom'
        break
      case 'Buttered Side Up':
        cook.value = 'erica lea'
        break
      case 'Chef Billy Parisi':
        cook.value = 'billy parisi'
        break
      case 'Chef James Makinson':
        cook.value = 'james makinson'
        break
      case 'Chef Ranveer Brar':
        cook.value = 'ranveer brar'
        cuisine.value = 'Indian'
        break
      case 'Chef Wang 美食作家王刚':
        cook.value = 'wang gang'
        cuisine.value = 'Chinese'
        break
      case 'Chinese Cooking Demystified':
        cook.value = 'stephanie li'// & chris thomas'
        cuisine.value = 'Chinese'
        break
      case 'Cooking with Kurt':
        cook.value = 'kurt bantilan'
        break
      case 'CookingWithRia':
        cook.value = 'ria birju'
        cuisine.value = 'Trinidad and Tobago'
        break
      case 'cuoredicioccolato':
        cook.value = 'andrea mercurio'
        cuisine.value = 'Italian'
        break
      case 'Downshiftology':
        cook.value = 'lisa bryan'
        break
      case 'East Meets Kitchen':
        cook.value = 'christina ng'
        break
      case 'emmymade':
        cook.value = 'emmy cho'
        break
      case 'Epic Gardening':
        cook.value = 'kevin espiritu'
        break
      case 'Epic Homesteading':
        cook.value = 'kevin espiritu'
        break
      case 'Evolving Table':
        cook.value = 'london brazil'
        break
      case 'Farmhouse on Boone':
        cook.value = 'lisa bass'
        break
      case 'Flock Finger Lakes':
        cook.value = 'summer rayne oakes'
        break
      case 'Food Wishes':
        cook.value = 'john mitzewich'
        break
      case 'Food with Chetna':
        cook.value = 'chetna makan'
        cuisine.value = 'Indian'
        break
      case 'foodiechina888':
        cook.value = 'wayne shen'
        cuisine.value = 'Chinese'
        break
      case 'FreshCap Mushrooms':
        cook.value = 'tony shields'
        break
      case 'Garden Answer':
        cook.value = 'laura leboutillier'
        break
      case 'Giallozafferano recipes':
        name.value = `${name.value} | giallo zafferano`
        cuisine.value = 'Italian'
        break
      case 'Greek Cuisine ':
        cook.value = 'greek cuisine'
        cuisine.value = 'Greek'
        break
      case 'Green Healthy Cooking':
        cook.value = 'lorena grater'
        break
      case 'Gordon Ramsay':
        cook.value = 'gordon ramsay'
        break
      case 'Hanbit Cho':
        cook.value = 'hanbit cho'
        break
      case 'How To Make Dinner':
        cook.value = 'paula hingley'
        break
      case 'Jamie Oliver':
        cook.value = 'jamie oliver'
        break
      case 'JapaneseCooking101':
        if (data.name.toLowerCase().includes('yuko')) {
          cook.value = 'yuko nakamura'
        }
        else {
          cook.value = 'noriko takano'
        }
        cuisine.value = 'Japanese'
        break
      case 'Jeanelleats':
        cook.value = 'jeanell castro'
        break
      case 'JJ citysingluten':
        cook.value = 'jj city sin gluten'
        break
      case 'Joshua Weissman':
        cook.value = 'joshua weissman'
        break
      case 'justinthetrees':
        cook.value = 'justin davies'
        break
      case 'KQED':
        cook.value = 'jacques pépin'
        cuisine.value = 'French'
        break
      case 'KWOOWK':
        cook.value = 'kevin tatar'
        break
      case 'Laura in the Kitchen':
        cook.value = 'laura vitale'
        break
      case 'lowcarbrecipeideas':
        cook.value = 'elsie yan'
        break
      case 'Maangchi':
        cook.value = 'maangchi'
        cuisine.value = 'Korean'
        break
      case `Marion's Kitchen`:
        cook.value = 'marion grasby'
        break
      case 'Mind Over Munch':
        cook.value = 'alyssia sheikh'
        break
      case 'Modern Pepper':
        cook.value = 'modern pepper'
        cuisine.value = 'Korean'
        break
      case 'My Name Is Andong':
        cook.value = 'arseny knaifel'
        break
      case 'Natashas Kitchen':
        cook.value = 'natasha kravchuk'
        break
      case 'No Recipes':
        cook.value = 'marc matsumoto'
        cuisine.value = 'Japanese'
        break
      case 'NOT ANOTHER COOKING SHOW':
        cook.value = 'stephen cusato'
        break
      case 'NutritionRefined':
        cook.value = 'petra scott'
        break
      case 'Oh Yum with Anna Olson':
        cook.value = 'anna olson'
        break
      case `Pailin's Kitchen`:
        cook.value = 'pailin chongchitnant'
        cuisine.value = 'Thai'
        break
      case 'Pick Up Limes':
        cook.value = 'sadia badiei'
        break
      case 'Prakticna zena':
        cook.value = 'praktična žena'
        break
      case 'Preppy Kitchen':
        cook.value = 'john kanell'
        break
      case 'Rajshri Food':
        cuisine.value = 'Indian'
        if(name.value.includes('varun')) {
          cook.value = 'varun inamdar'
          name.value.replace('| rajshri food', '')
          name.value.replace('chef varun', '')
        }
        else if(name.value.includes('bhumika')) {
          cook.value = 'bhumika bhurani'
          name.value.replace('| rajshri food', '')
          name.value.replace('chef bhumika', '')
        }
        else if(name.value.includes('ruchi')) {
          cook.value = 'ruchi bharani'
          name.value.replace('| rajshri food', '')
          name.value.replace('chef ruchi', '')
        }
        else {
          name.value = `${name.value} | rajshri food`
        }
        break
      case 'RecipeTin Eats':
        cook.value = 'nagi maehashi'
        break
      case 'Souped Up Recipes':
        cook.value = 'mandy fu'
        cuisine.value = 'Chinese'
        break
      case 'Spain on a Fork':
        cook.value = 'albert bevia'
        cuisine.value = 'Spanish'
        break
      case 'The Gluten Free Blogger':
        cook.value = 'sarah howells gfb'
        break
      case 'The Mediterranean Dish':
        cook.value = 'suzy karadsheh'
        break
      case 'TOKYO KITCHEN':
        cook.value = 'yoshimi daido'
        cuisine.value = 'Japanese'
        break
      case `Vincenzo's Plate`:
        cook.value = 'vincenzo prosperi'
        cuisine.value = 'Italian'
        break
      case 'You Suck At Cooking':
        name.value = `${name.value} | you suck at cooking`
        break
      case 'Your Food Lab':
        cook.value = 'sanjyot keer'
        cuisine.value = 'Indian'
        break
      default:
        if(data.ch) name.value = `${name.value} | ${data.ch.toLowerCase()}`
    }
  }
  name.addEventListener('blur', picName)
}


const getStore = url => {
  const strings = ['ebay']
  const stores = ['ebay']
  let data
  for(const s in strings) {
    if(url.includes(strings[s])) {
      data = stores[s]
    }
  }
  const store = document.querySelector('')
  //console.info(data)
  return data
}


const fixColor = e => {
  e.target.style.borderColor = '#0000'
  e.target.style.backgroundColor = '#1b1b31'
}


const handleData = (url, data) => {
if (url.includes('youtube.com')) {
    handleYoutube(data)
  }
  else handleBlog(data)
}


const checkIfUsed = async (data, dom) => {
  const url = `/checklink/${dom}/`
  doFetch(data, url)
  .then(json => {
    const box = document.querySelector('#site')
    if(json) {
      box.style.borderColor = '#2e66d2'
      box.style.backgroundColor = '#4c4c7d'
      box.addEventListener('change', fixColor)
    } else {
      box.style.borderColor = '#0000'
      box.style.backgroundColor = '#1b1b31'
    }
    return json
  })
}


const handleFetch = async e => {
  const dom = getDom()

  if (e.target.value && dom !== 'monitor' && dom !== 'store' && dom !== 'item') {
    // clean yt links
    if (e.target.value.includes('&list=')) {
      // for youtube list urls
      e.target.value = e.target.value.split('&list=')[0]
    }
    if (e.target.value.includes('&pp=')) {
      // for youtube result urls
      e.target.value = e.target.value.split('&pp=')[0]
    }
    const data = { url: e.target.value }
    

    const url = `/puppeteer/`

    await checkIfUsed(data, dom)
    
    const res = await doFetch(data, url)

    handleData(data.url, res)
  }
}


export default (async () => {
  const puppetMaster = (() => {
    const url = window.location.pathname.split('/')
    if (url.includes('add')) {
      const urlBox = document.querySelector('#site')

      if(urlBox) urlBox.addEventListener('blur', handleFetch)
    }
  })()
})()