/**
 * TODO: Change debut, fin to English
 */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Bouttons from '../Buttons/Button';
import Inputs from '../Inputs';

const useStyles = makeStyles((theme) => ({
  form: { marginTop: '10px', marginBottom: '10px', padding: '8px' },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.paper,
  },
  group: {
    height: '125px',
    padding: '4px',
    // backgroundColor: theme.palette.background.paper
  },
  unique: {
    display: 'flex',
    alignItems: 'column',
    // alignItems: 'center',
    justifyContent: 'center',
    height: '125px',
    // backgroundColor: theme.palette.background.paper
  },
}));
/**
 * Verifies if the specified argument is a finite number
 * @param {Number} number The number to verify
 * @returns {Boolean} Whether the specified argument is a finite number or not.
 */
export function isFinite(number) {
  return !Number.isNaN(parseFloat(number)) && Number.isFinite(parseFloat(number));
}
/**
 * Component that sends filter rules to its parent
 */
function Filters({
  inputs, keys, disabled, spacing, widthCoef, onChange, messages,
}) {
  // inp = {age:{type:'int',operators:['>','<']},Nom:{type:'varchar(40)',operators:['like']},
  // Poste:{type:'foreign',operators:['in'],possibles:[{label:'operateur',id:1},
  // {label:'ingenieur',id:2}]}]}}
  // defaultWidth est 12 par défaut mais peut changer si le container du filtre
  // est + petit par exemple
  const classes = useStyles();
  const [stateInput, setStateInput] = useState(inputs);
  const [state, setState] = useState([]);
  const [errors, setError] = useState([]);
  useEffect(() => {
    const k = keys === undefined ? Object.keys(inputs) : keys;
    // ne garder que les éléments affichables et transfomer les set/enum/foreign en foreigns
    const si = Object.keys(inputs).reduce((acc, cur) => {
      if (k.includes(cur)) {
        acc[cur] = { ...inputs[cur] };
        if (acc[cur].type.includes('enum') || acc[cur].type.includes('set')) {
          const pos = acc[cur].type
            .replace(/(\w+)\((.+)\)/, '$2')
            .replace(/'/gi, '')
            .split(',')
            .reduce((a, c) => a.concat({ label: c, value: c }), []);
          acc[cur].possibles = pos;
          acc[cur].type = 'foreigns';
        }
        if (acc[cur].type === 'foreign') {
          acc[cur].type = 'foreigns';
        }
      }
      return acc;
    }, {});
    setStateInput(si);
  }, [JSON.stringify(inputs), keys]);
  useEffect(() => {
    onChange(state);
  }, [JSON.stringify(state)]);

  const handleChange = (e, type, label, operator) => {
    let val;
    const st = [...state];
    const err = [...errors];
    if (type.includes('date') || type.includes('time')) {
      val = type === 'time' ? `${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}` : e;
    } else if (type === 'foreigns') {
      val = e.map((m) => m.value);
    } else if (e === null) {
      // cas du vidage d'un <Select
      val = null;
    } else {
      val = e.value || e.target.value;
    }
    if (type.includes('int') || type.includes('float') || type.includes('decimal')) {
      const oop = operator === '>' ? '<' : '>';
      const other = state.filter((s) => s.label === label && s.operator === oop);
      if (!isFinite(val) && !err.includes(label)) {
        setError(err.concat(label));
      } else if (other.length > 0) {
        if (
          ((operator === '>' && val > other[0].value)
            || (operator === '<' && val < other[0].value))
          && !err.includes(label)
        ) {
          setError(err.concat(label));
        } else {
          setError(err.filter((er) => er !== label));
        }
      } else {
        setError(err.filter((er) => er !== label));
      }
    }
    const ft = st.filter((f) => f.label !== label || f.operator !== operator);
    const fil = val !== null && val !== '' ? ft.concat({ label, operator, value: val }) : ft;
    setState(fil);
  };
  const coef = widthCoef;
  return (
    <Grid container className={classes.grid} spacing={spacing}>
      {Object.keys(stateInput).map((input) => {
        const inp = stateInput[input];
        if (
          inp.type.includes('varchar')
          || inp.type.includes('text')
          || inp.type.includes('foreign')
        ) {
          const op = inp.type === 'foreigns' ? 'in' : 'like';
          const exp = messages.contains || 'contains';
          const search = state.filter((s) => s.label === inp.label);
          return (
            <Grid
              item
              xs={11 * coef}
              sm={6 * coef}
              md={4 * coef}
              lg={3 * coef}
              xl={2 * coef}
              className={classes.unique}
            >
              <Inputs
                key={`${inp.label}(${exp})`}
                id={`${inp.label}(${exp})`}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp].length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={search.length > 0 ? search[0].value : ''}
                label={`${inp.label}(${exp})`}
                error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, inp.label, op)}
              />
            </Grid>
          );
        }
        if (
          inp.type.includes('int')
          || inp.type.includes('float')
          || inp.type.includes('decimal')
        ) {
          const min = state.filter((s) => s.label === inp.label && s.operator === '>');
          const max = state.filter((s) => s.label === inp.label && s.operator === '<');
          return (
            <Grid
              item
              xs={6 * coef}
              sm={5 * coef}
              md={4 * coef}
              lg={3 * coef}
              xl={2 * coef}
              className={classes.group}
            >
              <Inputs
                key={`${inp.label}(>)`}
                id={`${inp.label}(>)`}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={min.length > 0 ? min[0].value : ''}
                label={`${inp.label}(>)`}
                error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, inp.label, '>')}
              />
              <Inputs
                key={`${inp.label}(<)`}
                id={`${inp.label}(<)`}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={max.length > 0 ? max[0].value : ''}
                label={`${inp.label}(<)`}
                error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, inp.label, '<')}
              />
            </Grid>
          );
        }
        if (inp.type.includes('date') || inp.type.includes('time')) {
          const debut = state.filter((s) => s.label === inp.label && s.operator === 'debut');
          const fin = state.filter((s) => s.label === inp.label && s.operator === 'fin');
          return (
            <Grid
              container
              xs={6 * coef}
              sm={4 * coef}
              md={3 * coef}
              lg={2 * coef}
              xl={1 * coef}
              className={classes.group}
            >
              <Inputs
                key={`${inp.label}(debut)`}
                id={`${inp.label}(debut)`}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={debut.length > 0 ? debut[0].value : null}
                label={`${inp.label}(debut)`}
                error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, inp.label, 'debut')}
              />
              <Inputs
                key={`${inp.label}(fin)`}
                id={`${inp.label}(fin)`}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={fin.length > 0 ? fin[0].value : null}
                label={`${inp.label}(fin)`}
                error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, inp.label, 'fin')}
              />
            </Grid>
          );
        }
        return null;
      })}
      <Grid container xs={6} sm={4} md={3} lg={2} xl={1} className={classes.unique}>
        <Bouttons
          color="secondary"
          icon="refresh"
          // Label=reset?
          callback={() => {
            setState([]);
          }}
        />
      </Grid>
    </Grid>
  );
}

Filters.propTypes = {
  /**
   * array containing the possible rules for filtering
   */
  inputs: PropTypes.objectOf(
    PropTypes.shape({
      /**
       * Type of the field to filter on.
       */
      type: PropTypes.oneOf([
        'varchar',
        'text',
        'foreign',
        'foreigns',
        'int',
        'float',
        'decimal',
        'date',
        'time',
        'datetime',
      ]).isRequired,
      /**
       * Field's label
       */
      label: PropTypes.string.isRequired,
      /**
       * Possible values to chose from
       */
      possibles: PropTypes.arrayOf(PropTypes.string),
      /**
       * Icon used for representing the filter field
       */
      icon: PropTypes.node,
    }),
  ).isRequired,
  /**
   * Array containing the keys of the items to enable filtering on
   */
  keys: PropTypes.arrayOf(PropTypes.string),
  /**
   * Array containing the keys of the inputs to disable
   */
  disabled: PropTypes.arrayOf(PropTypes.string),
  /**
   * Material UI Grid spacing attribute
   */
  spacing: PropTypes.number,
  /**
   * Material UI Input grid container's width coefficient.
   */
  widthCoef: PropTypes.number,
  /**
   * callback fired when filters change. It's a function that takes state as argument<br />
   * __state[]:__ _{label, operator, value}_<br />
   * __state[].label:__ label of the filter field<br />
   * __state[].operator:__ Filtering operation: < , >, in, like, debut, fin<br />
   * __state[].type:__ Filter type: varchar, text, foreign, foreigns, int,<br />
   * float, decimal, date, time, datetime
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Alternative text to display in the component.
   *  Useful in case of using a language that's different from English.
   */
  messages: PropTypes.shape({
    contains: PropTypes.string,
  }),
};

Filters.defaultProps = {
  keys: [],
  // Test this
  disabled: [],
  spacing: 1,
  widthCoef: 1,
  messages: [],
};
export default Filters;
