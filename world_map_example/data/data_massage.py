import pandas as pd
import unidecode
#pip install Unidecode

df_isocodes = pd.read_csv("ISO-3166_country_codes.csv")
df_isocodes.shape
df_isocodes.columns

df_credit_ratings = pd.read_csv("world_countries_credit_ratings.csv")
df_credit_ratings.shape
df_credit_ratings.columns

df_credit_ratings['country_'] = df_credit_ratings['Country'].str.lower().apply(unidecode.unidecode)
df_isocodes['name_'] = df_isocodes['name'].str.lower().apply(unidecode.unidecode)

set(df_isocodes['name_'])
set(df_credit_ratings['country_'])

set(df_isocodes['name_']) - set(df_credit_ratings['country_'])

set(df_credit_ratings['country_']) - set(df_isocodes['name_'])


#left join on df_credit_ratings['country_'] = df_isocodes['name_']
#df1.merge(df2, left_on='lkey', right_on='rkey')

df_cr_iso = pd.merge(df_credit_ratings,
                 df_isocodes[['name_', 'alpha-3']],
                 left_on='country_',
                 right_on='name_',
                 how='left')


df_cr_iso.loc[df_cr_iso['alpha-3'].isna()].sort_values(by='Country', ascending=True)

df_cr_iso.to_csv("credit_ratings_iso_codes.csv", index=False)
df_cr_iso.shape
df_cr_iso.columns
#['Country', 'S&P', 'Moody's', 'Fitch', 'DBRS', 'TE', 'country_', 'name_', 'alpha-3']

#now left merge df_cr_iso onto world_population.csv
df_world_pop = pd.read_csv("world_population.csv")
df_world_pop.shape
df_world_pop.columns
#['name', 'code', 'pop']

df_world_pop_cr_iso = pd.merge(df_world_pop,
                 df_cr_iso,
                 left_on='code',
                 right_on='alpha-3',
                 how='left')
df_world_pop_cr_iso.shape
df_world_pop_cr_iso.columns
df_world_pop_cr_iso.head()
df_world_pop_cr_iso.drop(['country_', 'name_', 'alpha-3'], axis=1, inplace=True)
df_world_pop_cr_iso.rename(columns={"Moody's": "Moodys"}, inplace=True)
df_world_pop_cr_iso.rename(columns={"S&P": "SandP"}, inplace=True)
df_world_pop_cr_iso.to_csv('world_pop_cr_iso.csv', index=False)
