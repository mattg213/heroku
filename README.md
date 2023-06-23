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

Once the "light scraper" was finished running, it retrieved 4,777 results. We then created a json object out of the list and stored it in [vehicles.json](../python/data/vehicles.json)


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

The loop used to scrape all the items was set to save a new json file every 250 items completed just so if the script somehow errored or stopped running, we wouldn't lose all the data gained. They were saved into json files with a naming scheme that looked like [a.json](../python/data/a.json)

After the "deep scraper" completed its running cycle, the next step was to combine all the split files into one big json file to allow for easier reading and importing of data.

## Cleaning the Data
We created a seperate file for the purpose of cleaning our data. First and foremost, we loaded (all_data.json)[../python/data/all_data.json] into a Pandas dataframe to allow us to view and clean the data. The json file that held our data was using empty strings in place of a NULL value, so all we had to do was replace those empty strings with a NaN value with this function:

```python
compiled_data_df = compiled_data_df.replace('', np.nan)
```

After we replaced those values with non-null values we were able to look at how many values were missing from each column. After seeing the amount of data we had we decided on what columns weren't going to be of use for us because of the amount of data we had. These columns had as low as 31. The columns we decided to drop were dropped using this code:

```python
compiled_data_df.drop(['fuel_consumption_rate', 'horse_power', 'engine_size', 'country_of_manufacture', 'number_of_doors'], axis=1, inplace=True)
compiled_data_df.drop(['number_of_cylinders', 'interior_color', 'exterior_color'], axis=1, inplace=True)
```

Now that we dropped the columns we didn't want in our dataset, we are able to drop all NA values so that we have a DataFrame where every row has values. In the end, our dataset created 3040 rows for us to use.

In our column 'sold_date' we have a string with the format 'SOLD May 6, 2023' and we wanted to convert that into a datetime value. We created a function that replaces the string with a datetime value and replaces the value in the column. The code is as follows:

```python
def ConvertStringToDate(str):
    format = ' %b %d, %Y'
    time = str.replace('SOLD ', '')
    time = datetime.strptime(time, format)
    return time

compiled_data_df['sold_date'] = compiled_data_df['sold_date'].apply(lambda x: ConvertStringToDate(x))
```

Now that our dates are properly converted, we found that there were a couple redundancies in our 'condition' column to where there were multiple different values for 'Used' and also 'Certified pre-owned.' So we filtered it down to only 3 values, 'Used', 'New', and 'Certified pre-owned' using this method:

```python
def FilterCondition(string):
    if "Used" in string:
        return "Used"
    if "Certified pre-owned" in string:
        return "Certified pre-owned"
    if "New" in string:
        return "New"
    
compiled_data_df['condition'] = compiled_data_df['condition'].apply(lambda x: FilterCondition(x))
```

Next, we wanted to convert the numbers in our dataset to proper integers and floats instead of strings. So we converted the 'mileage' and 'year' columns to ints just simply using the ```astype()``` function like: ```compiled_data_df['mileage'].astype(int)```. Next we had to convert the price string to a float, but the string had dollar signs and commas in it preventing us from just using the same function. So, we had to get rid of those elements and then convert the price to a float and it was done as follows:

```python
def CleanPriceString(string):
    new_string =  string.replace('$', '')
    new_string = new_string.replace(',', '')
    return new_string

compiled_data_df['price'] = compiled_data_df['price'].apply(lambda x: CleanPriceString(x))

compiled_data_df['price'] = compiled_data_df['price'].astype(float)
```

## Creating the Database
