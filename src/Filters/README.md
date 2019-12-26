## Filters

Component that sends filter rules to its parent

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**disabled** | `Array[]<String>` | `[]` | :x: | Array containing the keys of the inputs to disable
**inputs** | `Object[#]<Shape>` |  | :white_check_mark: | array containing the possible rules for filtering
**inputs[#].icon** | `ReactNode` |  | :x: | Icon used for representing the filter field
**inputs[#].label** | `String` |  | :white_check_mark: | Field's label
**inputs[#].possibles** | `Array[]<String>` |  | :x: | Possible values to chose from
**inputs[#].type** | `Enum('varchar', 'text', 'foreign', 'foreigns', 'int', 'float', 'decimal', 'date', 'time', 'datetime')` |  | :white_check_mark: | Type of the field to filter on.
**keys** | `Array[]<String>` | `[]` | :x: | Array containing the keys of the items to enable filtering on
**messages** | `Shape` | `[]` | :x: | Alternative text to display in the component. Useful in case of using a language that's different from English.
**messages.contains** | `String` |  | :x: | 
**onChange** | `Function` |  | :white_check_mark: | callback fired when filters change. It's a function that takes state as argument<br /> __state[]:__ _{label, operator, value}_<br /> __state[].label:__ label of the filter field<br /> __state[].operator:__ Filtering operation: < , >, in, like, debut, fin<br /> __state[].type:__ Filter type: varchar, text, foreign, foreigns, int,<br /> float, decimal, date, time, datetime
**spacing** | `Number` | `1` | :x: | Material UI Grid spacing attribute
**widthCoef** | `Number` | `1` | :x: | Material UI Input grid container's width coefficient.

