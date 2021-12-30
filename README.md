# Goodreads Web-scraper
A Javascript tool that will scrape some data from goodreads on a user's ratings and favorite books

## Basic Functions

### `ask()`
Prompt the user for Goodreads ID to inspect/scrape data from. You can also enter a list of ids separated by spaces

### `main(id)`
Based on a given ID, the scraper will execute `getBooks(html)`, `ratingDiff()`, `goodHotTake()`, and `badHotTake()`. However if the user has a private profile page, none of these will be executed

### `getBooks(html)`
Given an html page, the scraper uses cheerio to create a list of books, saving the title, user rating and average goodreads rating (see example below)

    {
      title: "Klara and the Sun", 
      myRating: 5
      avgRating: 3.80
    }

### `ratingDiff()`
Calculates the user's average ratings and the average of the goodreads ratings for that user's books. Prints out the difference (see below)

    Anna's average rating is 3.736842105263158
    Anna's goodreads' average rating is 4.083157894736842
    Anna's ratings are on average 0.34631578947368413 lower than the goodreads community

### `goodHotTake()`
Finds the book with the greatest positive difference between `myRating` and `avgRating` to find the book the user liked more than most goodreads users (see below)

    Anna's biggest hot take is that Before the Coffee Gets Cold (Before the Coffee Gets Cold, #1) is a good book and deserves 5 stars even though goodreads says its 3.73 stars

### `badHotTake()`
Finds the book with the greatest negative difference between `myRating` and `avgRating` to find the book the user disliked more than most goodreads users (see below)

    Anna's biggest hot take is that Love Is a Mix Tape: Life and Loss, One Song at a Time is a bad book and deserves 2 stars even though goodreads says its 3.82 stars