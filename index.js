const PORT = 8000;

const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const readline = require("readline");

const books = [];
var user = {};

const app = express();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const ask = () => {
    rl.question("\nWhat is user's goodreads id? ", function (answers) {
        answers.split(' ').forEach(async id => {
            main(id)
        })
    });
}

ask()

const findFriends = id => {
    const friendsURL = `https://www.goodreads.com/friend/user/${id}`
    axios(friendsURL)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            console.log(html)
            // TODO must be able to login before you can scrape that data
            $('tr', '#friendTable').each(function () {
                const link = $(this).attr('href')
                const id = link.substring(11, link.indexOf('-'))
                console.log(link)
                console.log(id)
                main(id)
            })
        })

}

const main = async id => {
    const readBooksURL = `https://www.goodreads.com/review/list/${id}?shelf=read`
    // const userPageURL = `https://www.goodreads.com/user/show/${id}`
    // await axios(userPageURL)
    //     .then(response => {
    //         const html = response.data
    //         getUser(html)
    //     })
    await axios(readBooksURL)
        .then(response => {
            const html = response.data
            if (getUser(html)) {
                console.log(`\nGOODREADS DATA FOR ${user.toUpperCase()}`)
                getBooks(html);
                ratingDiff();
                goodHotTake();
                badHotTake();
            } else {
                console.log(`\n${user.toUpperCase()} HAS A PRIVATE PROFILE`)
            }
        }).catch(err => console.log(err))

    // app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
}


const translateRating = (text) => {
    switch (text) {
        case '\n        did not like it\n':
            return 1;
        case '\n        it was ok\n':
            return 2;
        case '\n        liked it\n':
            return 3;
        case '\n        really liked it\n':
            return 4;
        case '\n        it was amazing\n':
            return 5;
        default:
            return null
    }
}

const getUser = (html) => {
    const $ = cheerio.load(html)
    user = $('title').text().split(' ')[0]
    return $('*', '#privateProfile').contents().length == 0
}

const getBooks = (html) => {
    const $ = cheerio.load(html)
    $('.bookalike.review').each(function () {
        const title = $('a', $('.field.title', this)).attr('title');
        const myRating = translateRating($('.value', $('.field.rating', this)).text());
        const avgRating = parseFloat($('.value', $('.field.avg_rating', this)).text());
        myRating && books.push({
            title,
            myRating,
            avgRating,
        })
    })
}

const ratingDiff = () => {
    var sums = {
        me: 0,
        avg: 0,
    };
    books.forEach((book) => {
        sums.avg += book.avgRating
        sums.me += book.myRating
    })
    console.log(`${user}'s average rating is ${sums.me / books.length}`)
    console.log(`${user}'s goodreads' average rating is ${sums.avg / books.length}`)
    console.log(`${user}'s ratings are on average ${Math.abs((sums.me - sums.avg) / books.length)} ${(sums.me - sums.avg) > 0 ? 'higher' : 'lower'} than the goodreads community`)
}

const goodHotTake = () => {
    var favBook = { diff: 0 };
    books.forEach((book) => {
        if (book.myRating - book.avgRating > favBook.diff) {
            favBook = book;
            favBook.diff = book.myRating - book.avgRating;
        }
    })
    console.log(`${user}'s biggest hot take is that ${favBook.title} is a good book and deserves ${favBook.myRating} stars even though goodreads says its ${favBook.avgRating} stars`)
}

const badHotTake = () => {
    var favBook = { diff: 0 };
    books.forEach((book) => {
        if (book.avgRating - book.myRating > favBook.diff) {
            favBook = book;
            favBook.diff = book.avgRating - book.myRating;
        }
    })
    console.log(`${user}'s biggest hot take is that ${favBook.title} is a bad book and deserves ${favBook.myRating} stars even though goodreads says its ${favBook.avgRating} stars`)
}