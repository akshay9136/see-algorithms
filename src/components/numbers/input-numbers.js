import React, { useState } from "react";
import { showToast } from "../toast/toast";
import { Select, Input, Button, MenuItem } from "@mui/material";
import styles from "./numbers.module.css";
import { randomInt } from "@/common/utils";

function InputNumbers(props) {
  const [values, setValues] = useState([]);
  const [status, setStatus] = useState(false);
  const { min = 7, max = 12 } = props;

  const handleSelect = (e) => {
    const size = parseInt(e.target.value);
    const values = [];
    for (let i = 0; i < size; i++) {
      values.push(randomInt());
    }
    setValues(values);
    props.onSelect?.(size);
  };

  const handleInput = (e, i) => {
    let val = e.target.value.trim().slice(0, 3);
    if (!isNaN(val)) {
      values[i] = parseInt(val) || "";
      setValues([...values]);
    }
  };

  const validate = () => {
    for (let i = 0; i < values.length; i++) {
      if (typeof values[i] !== "number") {
        showToast({
          message: "Please enter valid numbers.",
          variant: "error",
        });
        setStatus(false);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!status) {
      if (validate()) {
        setStatus(true);
        props.onStart(values);
      }
    } else {
      props.onStop();
      setStatus(false);
      setValues([]);
    }
  };

  return (
    <div className={styles.inputNumbers}>
      <label className={styles.label}>
        {!values.length
            ? 'Select number of elements: '
            : props.label || 'Enter numbers: '}
        &nbsp;
      </label>
      {!values.length ? (
        <Select onChange={handleSelect} className={styles.select} size="small">
          <MenuItem></MenuItem>
          {Array.from(Array(max - min + 1))
            .map((_, i) => min + i)
            .map((i) => (
              <MenuItem key={i} value={i}>
                {i}
              </MenuItem>
            ))}
        </Select>
      ) : (
        <div className="d-flex">
          {values.map((val, i) => (
            <Input
              key={i}
              value={val}
              onChange={(e) => handleInput(e, i)}
              className={styles.number}
            />
          ))}
        </div>
      )}
      {values.length > 0 && (
        <div>
          <Button variant="contained" onClick={handleSubmit}>
            {!status
              ? props.startBtnText || 'Start'
              : props.stopBtnText || 'Stop'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default InputNumbers;
