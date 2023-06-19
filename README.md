# Used Car Project

[Visualization Website](https://hunterg003.github.io/CarProject/)

### About
Our goal is to obtain data from the sales of used cars...

### Group Members
- Hunter Gilliam
- Steven Steinbring
- Matt G
- Emmanuel Antwi

### Python Libraries Used
- BeautifulSoup
- Splinter
- PPrint
- Flask

### Javascript Libraries Used
- Chart.js

## Gathering Data
The first step to this project was gathering our data we wanted to work with. This was accomplished by building a scraper to sift through the sold vehicles section of eBay. There were filters placed on our scraper to only get vehicles that were sold in the United States and that were 2010 and newer.

There were two scripts created to scrape the data. The first script was what we will call a "light scraper." Its job was to go to the right section of eBay and apply the neccessary filters to get the list of vehicles we wanted. It accomplished this by grabbing some very simple data from the list that was returned by the website.

To show what data was being scraped, this was the dictionary used to retrieved data for each item: 

```python
 dictionary = {
    "title" : title.text,
    "price" : price.text,
    "sold_date" : sold_date.text,
    "item_url" : item_url['href']
 }
````

Once the "light scraper" was finished running, it retrieved just over 4,700 results. We then created a json object out of the list and stored it in [vehicles.json](../python/data/vehicles.json)
