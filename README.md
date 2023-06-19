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


The next step in the process of gathering our data was to build our second scraper we will call the "deep scraper." The job of this scraper was to go through the list of vehicles we have stored in [vehicles.json](../python/data/vehicles.json) and open their links to retrieve a deeper level of data for each vehicle.

The html of the page of the actual listing created some issues with how we were going to grab the data. The values we wanted to store weren't specified by a class or id like you will usually see. Instead a very generic class wrapped each item.

The two classes were: ``ux-labels-values__labels-content`` and `ux-labels-values__values-content`

We found that if you get an array of those two classes separately, their index values corresponded to each other. So all we had to do was verify what label was at the specific index value and then we could use that index to find the value we were looking for. We used a match statement to determine what label we were looking at.

A snippet of the match statement is as follows:

```python
labels = page.find_all(class_="ux-labels-values__labels-content")
values = page.find_all(class_="ux-labels-values__values-content")

for i, element in enumerate(labels):
        
    match element.text:
        case "Condition":
            condition = values[i].text
        case "Year":
            year = values[i].text
```

All the values were then stored into one single "item" dictionary. This is the dictionary with all the data we scraped:
```python
item = {
        "condition" : condition,
        "year" : year,
        "mileage" : mileage,
        "interior_color" : interior_color,
        "transmission" : transmission,
        "fuel_consumption_rate" : fuel_consumption_rate,
        "fuel_type" : fuel_type,
        "horse_power" : horse_power,
        "engine_size" : engine_size,
        "exterior_color" : exterior_color,
        "number_of_doors" : number_of_doors,
        "engine" : engine,
        "body_type" : body_type,
        "number_of_cylinders" : number_of_cylinders,
        "make" : make,
        "drive_type" : drive_type,
        "model" : model,
        "country_of_manufacture" : country_of_manufacture,
        "vehicle_title" : vehicle_title
}  
```

The loop used to scrape all the items was set to save a new json file every 250 items completed just so if the script somehow errored or stopped running, we wouldn't lose all the data gained. They were saved into json files with a naming scheme that looked like [0-250.json](../data/deep data/0-250.json)

After the "deep scraper" completed its running cycle, the next step was to combine all the split files into one big json file to allow for easier reading and importing of data.

## Creating The Database
