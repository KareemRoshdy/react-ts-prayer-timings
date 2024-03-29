import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import ImageCard from "./ImageCard";
import Box from "@mui/material/Box";
import { SyntheticEvent, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import "moment/dist/locale/ar";
moment.locale("ar");

const MainContent = () => {
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split("T")[0];
  const [today, setToday] = useState("");
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");

  const [data, setData] = useState(null);
  const [timings, setTimings] = useState({
    fajr: "",
    dhuhr: "",
    asr: "",
    maghrib: "",
    isha: "",
  });
  const [search, setSearch] = useState("");
  const [temp, setTemp] = useState("");

  const prayerArray = [
    { key: "fajr", name: "الفجر", time: timings.fajr },
    { key: "dhuhr", name: "الظهر", time: timings.dhuhr },
    { key: "asr", name: "العصر", time: timings.asr },
    { key: "maghrib", name: "المغرب", time: timings.maghrib },
    { key: "isha", name: "العشاء", time: timings.isha },
  ];

  const getData = async () => {
    const res = await axios(
      `https://api.aladhan.com/v1/timingsByAddress/${currentDay}?address=القاهرة`
    );

    const times = {
      fajr: res.data.data.timings.Fajr,
      dhuhr: res.data.data.timings.Dhuhr,
      asr: res.data.data.timings.Asr,
      maghrib: res.data.data.timings.Maghrib,
      isha: res.data.data.timings.Isha,
    };

    setData(res.data.data);
    setTimings(times);
  };

  useEffect(() => {
    getData();
    const date = moment();
    setToday(date.format("Do MMM YYYY | h:mm"));
  }, []);

  const get = async () => {
    const res = await axios(
      `https://api.aladhan.com/v1/timingsByAddress/${currentDay}?address=${search}`
    );

    const times = {
      fajr: res?.data.data.timings?.Fajr,
      dhuhr: res?.data.data.timings?.Dhuhr,
      asr: res?.data.data.timings?.Asr,
      maghrib: res?.data.data.timings?.Maghrib,
      isha: res?.data.data.timings?.Isha,
    };

    setTimings(times);
    setData(res.data.data);
    setTemp(search);
  };

  function searchHandler(e: SyntheticEvent) {
    e.preventDefault();
    setData(null);

    if (search !== "") {
      get();

      setSearch("");
    } else {
      alert("ادخل اسم المدينة");
      getData();
    }
    setSearch("");
  }

  useEffect(() => {
    const t = setInterval(() => {
      setUpCountdownTimer();
    }, 1000);
    return () => {
      clearInterval(t);
    };
  }, [timings]);

  const setUpCountdownTimer = () => {
    const momentNow = moment();
    let nextPrayer: number = 0;

    if (
      momentNow.isAfter(moment(timings.fajr, "hh:mm")) &&
      momentNow.isBefore(moment(timings.dhuhr, "hh:mm"))
    ) {
      nextPrayer = 1;
    } else if (
      momentNow.isAfter(moment(timings.dhuhr, "hh:mm")) &&
      momentNow.isBefore(moment(timings.asr, "hh:mm"))
    ) {
      nextPrayer = 2;
    } else if (
      momentNow.isAfter(moment(timings.asr, "hh:mm")) &&
      momentNow.isBefore(moment(timings.maghrib, "hh:mm"))
    ) {
      nextPrayer = 3;
    } else if (
      momentNow.isAfter(moment(timings.maghrib, "hh:mm")) &&
      momentNow.isBefore(moment(timings.isha, "hh:mm"))
    ) {
      nextPrayer = 4;
    } else {
      nextPrayer = 0;
    }

    setNextPrayerIndex(nextPrayer);

    const nextPrayerObj = prayerArray[nextPrayer];
    const nextPrayerTime = nextPrayerObj.time;
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);
    const durationRemainingTime = moment.duration(remainingTime);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajerToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiff = midnightDiff + fajerToMidnightDiff;

      remainingTime = totalDiff;
    }

    setRemainingTime(
      `${durationRemainingTime.seconds()}:${durationRemainingTime.minutes()}:${durationRemainingTime.hours()}`
    );
  };

  return (
    <>
      {/* TOP ROW */}
      <div className="top">
        <Grid container>
          <Grid xs={6}>
            <div>
              <h1>{temp !== "" ? temp : "القاهرة"}</h1>
              <p style={{ color: "var(--gray)" }}>{today}</p>
            </div>
          </Grid>

          <div className="search">
            <Grid xs={6} style={{ padding: "20px 0" }}>
              <Box sx={{ minWidth: 120 }}>
                <form className="form" onSubmit={searchHandler}>
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="اسم المدينة"
                    value={search}
                  />
                  <button className="btn">بحث</button>
                </form>
              </Box>
            </Grid>
          </div>
        </Grid>
      </div>
      {/* TOP ROW */}

      <Divider style={{ background: `var(--gray)` }} />

      {/* Preyer Cards */}
      {data ? (
        <div className="content" style={{ padding: "10px 0" }}>
          <Grid container spacing={2}>
            {/* image */}
            <Grid xs={6} style={{ padding: "20px" }}>
              <ImageCard
                time={remainingTime}
                name={prayerArray[nextPrayerIndex].name}
              />
            </Grid>
            {/* image */}

            {/* Times */}
            <Grid xs={6} style={{ padding: "20px" }}>
              <Stack>
                <Prayer name="الفجر" time={timings.fajr} />
                <Prayer name="الظهر" time={timings.dhuhr} />
                <Prayer name="العصر" time={timings.asr} />
                <Prayer name="المغرب" time={timings.maghrib} />
                <Prayer name="العشاء" time={timings.isha} />
              </Stack>
            </Grid>
            {/* Times */}
          </Grid>
        </div>
      ) : (
        <h3 className="loading"></h3>
      )}
      {/* Preyer Cards */}
    </>
  );
};

export default MainContent;

// 1:00:20
