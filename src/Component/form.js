import React, { useState, useCallback } from "react";
import axios from "axios";
import classes from "./form.module.css";

const Form = () => {
  //state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [time, setTime] = useState("00:00:00");
  const [date, setDate] = useState("");
  const [sent, setSent] = useState(false);

  //handles input and calls two functons to format the date in required format
  //and then send the email after the required time.
  const submitHandler = (event) => {
    event.preventDefault();
    const sendDateTime = dateToSend(); //function call
    let testDate = new Date(sendDateTime); //create new Date object with inputted time in local time zone
    let currentDate = new Date();
    sendEmail(testDate - currentDate); //calling the sendmail function with time in milliseconds
    setSent(true);
  };

  //reset the form
  const resetHandler = () => {
    setName("");
    setEmail("");
    setTextMessage("");
    setTime("00:00:00");
    setDate("");
    setSent(false);
  };

  //sends the email after the given time(in milliseconds)
  const sendEmail = useCallback(
    (time) => {
      axios
        .post("http://localhost:5000/sendemail", {
          name: name,
          email: email,
          textMessage: textMessage,
          time,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    [email, name, textMessage]
  );

  //returns the time formatted with local time zone concatenated
  const dateToSend = () => {
    let hour = time.substring(0, 2);
    let min = time.substring(3, 5);
    let currentDate = new Date();

    // formats hour
    let offsetHour = (0 - currentDate.getTimezoneOffset()) / 60;

    if (offsetHour < 0) {
      offsetHour = offsetHour.toString();
      if (offsetHour.length === 2) {
        offsetHour = "-0" + offsetHour.substring(1);
      }
    } else {
      offsetHour = offsetHour.toString();
      if (offsetHour.length === 1) {
        offsetHour = "0" + offsetHour.substring(1);
      }
    }

    //formats minute
    let offsetMin = currentDate.getTimezoneOffset() % 60;
    offsetMin = offsetMin.toString();
    if (offsetMin.length === 1) {
      offsetMin = "0" + offsetMin;
    }

    //return formatted date and time
    return (
      date + "T" + hour + ":" + min + ":" + "00" + offsetHour + ":" + offsetMin
    );
  };

  //css class for sent message
  let sendMessage = !sent ? classes.setMessage : classes.showMessage;

  return (
    <div className={classes.container}>
      <header className={classes.header}>Premail</header>
      <form className={classes.Form}>
        <input
          className={classes.Input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <br />
        <br />
        <input
          className={classes.Input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <br />
        <textarea
          className={classes.Textarea}
          type="text"
          value={textMessage}
          rows="10"
          cols="30"
          onChange={(event) => setTextMessage(event.target.value)}
          placeholder="Type your message here"
        />
        <input
          type="date"
          className={classes.dateTime}
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
          }}
        />
        <input
          type="time"
          className={classes.dateTime}
          value={time}
          onChange={(event) => {
            setTime(event.target.value);
          }}
        />
        <br />
        <br />
        <button
          type="submit"
          className={classes.submit}
          onClick={submitHandler}
        >
          Submit
        </button>
        <button type="reset" className={classes.reset} onClick={resetHandler}>
          Reset
        </button>
      </form>
      <div className={sendMessage}>Email set to send on specified time!!!</div>
    </div>
  );
};

export default Form;
