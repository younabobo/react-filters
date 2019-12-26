import React, { Component, useMemo, fragment } from 'react';
// import PickupLocation from './Maps/PickupLocation';
import {
  Avatar,
  Typography,
  TextField,
  FormGroup,
  Checkbox,
  Grid,
  Card,
  Tooltip,
  Badge,
  InputLabel,
  FormControl,
  FormLabel,
  FormControlLabel,
  InputAdornment,
  Button,
  Breadcrumbs,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Icon from '@material-ui/core/Icon';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// import { defaultZoom, path, googleMapsKey } from "../context/Params";
// import Maps from './Maps/Maps';
// import AutoCompAddress from './Maps/AutoCompAddress';
// import ColorPicker from "material-ui-color-picker";
// import { MuiPickersUtilsProvider, TimePicker, DatePicker, DateTimePicker} from "material-ui-pickers";
import Select from 'react-select';

const Inputs = (props) => {
  // id:int disabled: bool error:bool onChange:fct
  const {
    id,
    type,
    filtre,
    label,
    value,
    icon,
    required,
    suffixe,
    disabled,
    error,
    possibles,
    tootltip,
    autoFocus,
    onChange,
    onRemove,
  } = props;
  const CalculSize = (length = 7) => {
    if (length < 6) {
      return [6, 3, 2, 2, 1];
    } if (length < 21) {
      return [6, 6, 4, 3, 2];
    } if (length < 51) {
      return [12, 9, 7, 6, 5];
    } if (length < 101) {
      return [12, 12, 9, 8, 6];
    }
    return [12, 12, 12, 12, 12];
  };

  const typeAndLength = (t) => {
    // 7 sera la valeur de tout ceux qui n'ont pas de length
    const rslt = new Object();
    rslt.contentType = t.replace(/(\w+)\((.+)\)/, '$1');
    rslt.detail = t.replace(/(\w+)\((.+)\)/, '$2').split(',');
    const between = rslt.detail.reduce((acc, cur) => acc + parseInt(cur), 0);
    rslt.long = between > 0 ? between : 20; // si il y'avait des caractères entre () la condition donnera false
    return rslt;
  };

  let { contentType, detail, long } = { ...typeAndLength(type) };
  if (possibles.length > 0 && typeof possibles[0] === 'object') {
    // pour les foreign
    long = possibles.reduce((acc, cur) => {
      acc = Math.max(acc, parseInt(cur.label.length * 2));
      return acc;
    }, 0);
  } else if (possibles.length > 0) {
    // pour les enum/set
    long = possibles.reduce((acc, cur) => {
      acc = Math.max(acc, cur.length);
      return acc;
    }, 0);
  }
  const [xs, sm, md, lg, xl] = CalculSize(long);
  const undefProp = (prop, substitute) => {
    if (prop === undefined) {
      return substitute;
    }
    return prop;
  };

  const formElement = () => {
    const length = props.length === undefined ? long : props.length;
    switch (contentType) {
      case 'int':
        {
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              required={required || false}
              error={error || false}
              type="number"
              value={value || ''}
              onChange={onChange}
              disabled={disabled || false}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>
                      {' '}
                      {icon || null}
                      {' '}
                    </Icon>
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{suffixe || ''}</InputAdornment>,
              }}
            />
          );
        }
        break;
      case 'decimal':
        {
          const stp = 1 / Math.pow(10, detail[1]);
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              required={required || false}
              error={error || false}
              type="number"
              value={value || ''}
              onChange={onChange}
              disabled={disabled || false}
              inputProps={{ step: stp }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>
                      {' '}
                      {icon || null}
                      {' '}
                    </Icon>
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{suffixe || ''}</InputAdornment>,
              }}
            />
          );
        }
        break;
      case 'float':
        {
          return (
            <TextField
              autoFocus={autoFocus}
              name={id}
              label={label}
              required={required || false}
              error={error || false}
              type="number"
              value={value || ''}
              onChange={onChange}
              disabled={disabled || false}
              inputProps={{ step: 0.001 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>
                      {' '}
                      {icon || null}
                      {' '}
                    </Icon>
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">{suffixe || ''}</InputAdornment>,
              }}
            />
          );
        }
        break;
      case 'color':
        {
          return (
            <label htmlFor={id || ''}>
              {' '}
              {label || 'Couleur'}
              <input
                key={id || null}
                type="color"
                value={value || null}
                onChange={onChange}
                disabled={disabled || false}
              />
            </label>
          );
        }
        break;
      case 'foreigns':
      case 'foreign':
        {
          return (
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">
                {' '}
                <Icon>{icon || null}</Icon>
                {' '}
              </FormLabel>
              <Select
                name={id}
                isSearchable
                isClearable
                isDisabled={disabled || false}
                isMulti={contentType === 'foreigns'}
                placeholder={label || ''}
                required={required !== undefined ? required : false}
                onChange={onChange}
                label={label || null}
                options={possibles !== undefined ? possibles : null}
                fullWidth
                //   styles={customStyles}
                value={
                  contentType === 'foreigns'
                    ? possibles.filter((p) => value.includes(p.value)) || []
                    : possibles.filter((p) => p.value === value)[0] || null
                }
                error={error || false}
              />
            </FormControl>
          );
        }
        break;
      case 'enum':
        {
          return (
            <FormControl
              component="fieldset"
              style={{ border: '2px solid gray', padding: '10px', position: 'none' }}
            >
              <FormLabel style={{ marginLeft: '15px' }} component="legend">
                {' '}
                {label || 'Choix'}
                {' '}
              </FormLabel>
              <RadioGroup
                aria-label={label || null}
                name={id}
                id={id}
                value={value || ''}
                onChange={onChange}
              >
                {detail.map((rad) => (
                  <FormControlLabel
                    value={rad}
                    control={<Radio />}
                    label={rad}
                    disabled={disabled || false}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );
        }
        break;
      case 'set':
        {
          return (
            <FormControl
              component="fieldset"
              style={{ border: '2px solid gray', padding: '10px', position: 'none' }}
            >
              <FormLabel style={{ marginLeft: '15px' }} component="legend">
                {' '}
                {label || 'Selection'}
                {' '}
              </FormLabel>
              <FormGroup>
                {detail.map((chbx) => (
                  <FormControlLabel
                    value={chbx}
                    control={(
                      <Checkbox
                        name={id}
                        disabled={disabled || false}
                        checked={typeof value === 'string' ? value.includes(chbx) : false}
                        onChange={onChange}
                        value={chbx}
                      />
                      )}
                    label={chbx}
                  />
                ))}
              </FormGroup>
            </FormControl>
          );
        }
        break;
      case 'dateP': // dates passées seulement
      case 'dateF': // veut dire date futur seulement
      case 'date':
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                label={label || ''}
                name={id}
                clearable
                clearLabel="Vider"
                autoOk
                allowKeyboardControl
                showTodayButton
                todayLabel="Maintenant"
                disabled={disabled || false}
                keyboardIcon={icon !== undefined ? (
                  <Icon>
                    {' '}
                    {icon}
                    {' '}
                  </Icon>
                ) : <Icon> event </Icon>}
                invalidDateMessage="Format invalide !"
                placeholder={new Date().toISOString().split('T')[0]}
                minDate={
                  contentType === 'dateF'
                    ? new Date().toISOString().split('T')[0]
                    : new Date('0000-01-01')
                }
                maxDate={
                  contentType === 'dateP'
                    ? new Date().toISOString().split('T')[0]
                    : new Date('3333-12-31')
                }
                value={value || null}
                onChange={(date) => onChange(date.toISOString().split('T')[0])}
                format="yyyy-MM-dd"
              />
            </MuiPickersUtilsProvider>
          );
        }
        break;
      case 'time':
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                ampm={false}
                name={id}
                label={label || ''}
                clearable
                clearLabel="Vider"
                invalidDateMessage="Format invalide !"
                showTodayButton
                todayLabel="Maintenant"
                autoOk
                keyboardIcon={
                  icon !== undefined ? (
                    <Icon>
                      {' '}
                      {icon}
                      {' '}
                    </Icon>
                  ) : <Icon> access_time </Icon>
                }
                disabled={disabled || false}
                placeholder={new Date().toISOString().split('T')[1]}
                // mask="__:__ _M"
                value={value || null}
                onChange={(time) => onChange(time)}
              />
            </MuiPickersUtilsProvider>
          );
        }
        break;
      case 'datetimeP':
      case 'datetimeF':
      case 'datetime':
        {
          return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                ampm={false}
                name={id}
                allowKeyboardControl
                clearable
                clearLabel="Vider"
                invalidDateMessage="Format invalide !"
                showTodayButton
                todayLabel="Maintenant"
                label={label || ''}
                keyboardIcon={icon !== undefined ? (
                  <Icon>
                    {' '}
                    {icon}
                    {' '}
                  </Icon>
                ) : <Icon> event </Icon>}
                placeholder={new Date().toISOString()}
                disabled={disabled || false}
                onError={console.log('erreur')}
                minDate={
                  contentType === 'datetimeF' ? new Date().toISOString() : new Date('0000-01-01')
                }
                maxDate={
                  contentType === 'datetimeP' ? new Date().toISOString() : new Date('3333-12-31')
                }
                value={value || null}
                onChange={onChange}
                format="yyyy-MM-dd hh:mm"
              />
            </MuiPickersUtilsProvider>
          );
        }
        break;
      case 'file':
      case 'files': {
        let totalSize = 0;
        let files = [];
        const names = [];
        if (value === undefined || value === null || value.length < 1) {
          files = [];
        } else {
          files = document.getElementById(id) ? document.getElementById(id).files : [];
          if (files.length === 0) {
            files = value.split(',');
          }
          console.log('files = ', files);
          for (let i = 0; i < files.length; i++) {
            if (files[i].size) {
              totalSize += files[i].size;
            } else {
              totalSize = 'Inconnue';
            }
            names.push(files[i].name || files[i]);
          }
        }
        return (
          <fragment style={{ display: 'flex' }}>
            <Tooltip title={label || 'Choix fichier'}>
              <Button
                disabled={disabled || false}
                variant="contained"
                component="label"
                color="secondary"
              >
                <Icon>
                  {' '}
                  {icon || 'cloud_upload'}
                  {' '}
                </Icon>
                <input
                  type="file"
                  id={id}
                  name={id}
                  multiple={contentType === 'files'}
                  onChange={onChange}
                  style={{ display: 'none' }}
                />
              </Button>
            </Tooltip>
            <Tooltip title={names.join(' / ')}>
              <Typography variant="h5" color="secondary">
                {`${files.length === 0 ? 'aucun' : files.length} fichier(s)\n ${parseInt(
                  totalSize / 1024,
                )} Ko`}
              </Typography>
            </Tooltip>
          </fragment>
        );
      }
      case 'image':
      //   case "images" :
      //   let uploadedImages = [];
      //   let serverImages = value === undefined || value === null || value.length<2 ? [] : value.split(',');
      //   if(value !== undefined && value !== null && value.length > 0){
      //     uploadedImages = document.getElementById(id) ? document.getElementById(id).files : []
      //   }
      //   const avatars = ui =>{ let vi = [];
      //    for(let i=0; i<ui.length; i++){
      //   vi.push(<Tooltip title={`${ui[i].name}:${parseInt(ui[i].size/1024)} Ko`}><Avatar alt={`Image ajoutée ${i}`} src={URL.createObjectURL(ui[i])} /></Tooltip>) }
      //   return(vi) }
      //   return( <fragment style={{display:'flex'}}>
      //   <Button
      //     disabled={disabled || false}
      //     variant="contained"
      //     component="label"
      //     color="secondary"
      //   >
      //     <Icon> {icon || 'image'} </Icon>
      //     {label || "Choix Image"}
      //     <input
      //       type="file" accept="image/*" id={id} name={id} multiple={contentType==="images"}
      //       onChange={e=>{if(contentType==="image"){onRemove(e,serverImages[0])} onChange()}} style={{ display: "none" }}
      //     />
      //   </Button>
      //   {contentType==="images" ?
      //   (<Breadcrumbs color="primary" separator={serverImages.length > 0 && uploadedImages.length > 0 ? "  " : ""}>
      //     <span style={{display:'flex',justifyContent:'space-around'}} >{
      //       serverImages.map((si,i)=>{ let vi = []
      //        if(si.includes('/')){ vi.push(
      //       <Badge component="a" href="/" onClick={e=>{onRemove(e,si)}} badgeContent='x' color="primary">
      //         {/* <Tooltip title={`${path}${si}`}><Avatar alt={`Image d'origine ${i}`} src={`${path}${si}`}/></Tooltip> */}
      //       </Badge>)}
      //         return vi})
      //     }</span>
      //     <span style={{display:'flex',justifyContent:'space-around'}}>{ avatars(uploadedImages) }
      //     {/* <Button icon="clear" callback={onRemove(id)} /> */}
      //     </span>

      //   </Breadcrumbs>) :
      //   (
      //    uploadedImages.length === 1 ?
      //    (<span style={{display:'flex',justifyContent:'space-around'}}>{ avatars(uploadedImages) }</span>) :
      //     (<Tooltip title={`${value || 'Aucune image'}`}>{value && value !== null ? <Avatar alt={`${label} ${value}`}
      //     src={value ? `${path}${value}` : uploadedImages[0]}/> : <span> Aucune image </span>}</Tooltip>)
      //   )}
      //   </fragment>
      // )
      // break;
      // case "geo" : return(
      //   <PickupLocation name={id} label={label || "Localisation"} zoom={defaultZoom}
      //     /*center={JSON.parse(value)}*/ onDblClick={onChange}
      //   />
      // )
      // break;
      // case "address" :
      //   return(
      //     <AutoCompAddress id={id} defaultValue={value} label={label || "Adresse"} onChange={onChange} zoom={12} />
      //   )
      // break;
      case 'text':
        {
          return (
            <TextareaAutosize
              rowsMax={3}
              style={{ width: '90%' }}
              aria-label="maximum height"
              placeholder={label}
              value={value}
              onChange={onChange}
            />
          );
        }
        break;
      default: {
        return (
          <TextField
            name={id}
            label={label}
            required={required || false}
            error={error || false}
            value={value || ''}
            onChange={onChange}
            type={contentType}
            disabled={disabled || false}
            multiline={contentType === 'text'}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>
                    {' '}
                    {icon || null}
                    {' '}
                  </Icon>
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">{suffixe || ''}</InputAdornment>,
            }}
          />
        );
      }
    }
  };

  return filtre ? (
    <Grid id={`Grid${id}`} style={{ margin: '12px', width: '100%' }} item>
      {formElement()}
    </Grid>
  ) : (
    <Grid
      id={`Grid${id}`}
      style={{ margin: '12px', width: '100%' }}
      item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
    >
      {formElement()}
    </Grid>
  );
};
Inputs.defaultProps = {
  possibles: [],
};
export default Inputs;
