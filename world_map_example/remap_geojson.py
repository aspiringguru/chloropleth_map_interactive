import pandas as pd
import json

json_filename_in = 'world.geojson'
json_filename_out = 'world_new.geojson'

#df = pd.read_csv('world_population.csv',  error_bad_lines=False)
df = pd.read_csv('world_population_match_geojson.csv',  error_bad_lines=False)
df.loc[df['code'] == 'ZWE']
#b'Skipping line 64: expected 3 fields, saw 4\n
#Skipping line 95: expected 3 fields, saw 4\n
#Skipping line 97: expected 3 fields, saw 4\n'
#fix these lines manually in original data.
data = pd.read_json(json_filename_in)
len(data) #177
type(data)#<class 'pandas.core.frame.DataFrame'>
data.shape#(177, 2)
data.columns#Index(['type', 'features'], dtype='object')
country_names_geo_json = []
for feature in data['features']:
    print(feature['properties']['name'])
    country_names_geo_json.append(feature['properties']['name'])
    #print("population : ",feature['properties']['population'])

#now get list of country names from the .csv
country_names_csv = list(df['name'])
len(country_names_geo_json)
len(country_names_csv)

set(country_names_geo_json).difference(set(country_names_csv))
#country_names_geo_json-country_names_csv

set(country_names_csv).difference(set(country_names_geo_json))
#country_names_csv-country_names_geo_json










for i in range(len(data)):
    print(i)
    print(str(data['features'][i]['properties'])+" : "+str(data['features'][i]['id'])) # returns ie {'name': 'Afghanistan'}
    country_code = str(data['features'][i]['id'])
    try:
        country_pop = int(df.loc[df['code'] == country_code]['pop'])
    except Exception as e:
        country_pop = 0
        print("error matching country codes. @ data['features']["+str(i)+"]['id']="+country_code)
        print("set country_pop =", country_pop)
    print("country_code="+country_code+", country_pop="+str(country_pop))
    #now add population to dictionary
    data['features'][i]['properties'].update( {'population' : country_pop} )

data.to_json(json_filename_out)
