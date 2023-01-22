const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (sum, item) => {
        return sum.likes > item.likes ? sum : item
    }
    const mostLiked =  blogs.reduce(reducer)
    return {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
}

const mostBlogs = (blogs) => {
    const authors = lodash.countBy(blogs, 'author')
    console.log(authors)
    const mostBlogs = lodash.maxBy(Object.entries(authors), (o) => o[1])
    console.log(Object.entries(authors))
    console.log(mostBlogs)
    return {
        author: mostBlogs[0],
        blogs: mostBlogs[1]
    }
}

const mostLikes = (blogs) => {
    const authors = lodash(blogs)
        .groupBy('author')
        .map((objs, key) => ({
            'author': key,
            'likes': lodash.sumBy(objs, 'likes')
        }))
        .value()
    const mostLikes = lodash.maxBy(authors, (o) => o.likes)
    console.log(mostLikes)
    return {
        author: mostLikes.author,
        likes: mostLikes.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }