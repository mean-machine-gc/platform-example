# Constraint Decision Table

| Command Type       | Constraint Function     | Condition                                | Failure Message                 |
|--------------------|-------------------------|-------------------------------------------|----------------------------------|
| create-treatment   | _hfMustBeEnabled        | allowedTreatments.indexOf(treatmentType) === -1 | health_facility_not_allowed |
| create-treatment   | _equipmentMustBeInGoodOrder | !accumulator.inGoodOrder                  | equipment_out_of_order |
| load-treatment     | _atLeastOneWasteBagLoaded | !wasteBags.length                         | no_waste_bags_provided |
| load-treatment     | _atLeastOneWasteBagLoaded | !allowedCategories || !allowedCategories.length | no_waste_categories_allowed |
| load-treatment     | _atLeastOneWasteBagLoaded | !allowedBags.length                       | waste_category_not_allowed |
