import React, { useEffect, useState } from "react";
import styles from "./countdown.module.scss";

const defaultRemainingTime = {
  seconds: "00",
  minutes: "00",
  hours: "00",
};

function calculateDiffToMidnight() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0); // Set to the next midnight
  const diff = nextMidnight.getTime() - now.getTime();

  return {
    hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
    minutes: String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0"),
    seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
  };
}

export default function Countdown() {
  const [remainingTime, setRemainingTime] = useState(defaultRemainingTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateDiffToMidnight());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval
  }, []);

  return (
    <div className={styles.countdown}>
      <span>{remainingTime.hours[0]}</span>
      <span>{remainingTime.hours[1]}</span>
      <b>:</b>
      <span>{remainingTime.minutes[0]}</span>
      <span>{remainingTime.minutes[1]}</span>
      <b>:</b>
      <span>{remainingTime.seconds[0]}</span>
      <span>{remainingTime.seconds[1]}</span>
    </div>
  );
}
