# TODO

## 1. OSR Load Current Player Rankings

Need a way to load current player rankings from the db when updating rankings or migrating data for players that have historic data in the existing ranking dataset.

<https://openskill.me/en/stable/manual.html>

```txt
More often than not you’ll want to store at least the mu and sigma values of the players in a database. This means if you want to conduct another match, you’ll have to load the players back from the database. We have a helper method to create a player from a list of mu and sigma values. Just call the model’s create_rating method.

p1 = model.create_rating([23.035705378196937, 8.177962604389991], "jill678")
```
