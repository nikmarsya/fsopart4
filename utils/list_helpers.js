const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((total,blog) => {
        return total + blog.likes
    },0)
}

const favoriteBlog = (blogs) => {

    const obj = blogs.reduce((max,blog) => { 
        return max.likes>blog.likes?max:blog
    },blogs[0])

    const fav = {
        title: obj.title,
        author:obj.author,
        likes:obj.likes
    }
    return fav
}

const mostBlog = (blogs) => {
    const mostList = _.countBy(blogs,(b) => {
        return b.author
      })
      
      const mostArray = Object.entries(mostList)
      const mostMax = mostArray.reduce((max,b) => {
         return max[1]>b[1]?max:b
      },mostArray[0])

    const most = {
        author:mostMax[0],
        blogs:mostMax[1]
    }

    return most
}

const mostLikes = (blogs) => {
    const authors = blogs.reduce((temp,elem) => {
        if(!temp.includes(elem.author))
           return temp.concat(elem.author)
        else
          return temp
      },[])
    
      let result = []
      authors.forEach( a => { 
      let sumlikes = _.sumBy(blogs, b =>{
        return b.author===a?b.likes:0
       })
       result = result.concat(sumlikes)
    })

    const highestlikes = Math.max(...result)
    const index = result.indexOf(highestlikes)
    const most = {
        author:authors[index],
        likes:highestlikes
    }

    return most
}
module.exports = { dummy,totalLikes,favoriteBlog,mostBlog,mostLikes }