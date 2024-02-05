import axios from "axios";
import React, { useState, useEffect } from "react";
import Chatbot from "../Layouts/Chatbot";
import { Interaction } from "../Layouts/Chatbot";
import { numMessagesState } from "../../config/atoms";
import { useRecoilState } from "recoil";

export const ChatbotPage = React.memo((props: any) => {
  const [msgCount, setCount] = useRecoilState(numMessagesState);
  const [userCred, setUserCred] = useState<UserInfo>({
    age: 18,
    email: "",
    gender: "",
    summary: "",
    username: "",
    password: "",
    symptom: "",
    userId: "",
    belief: "",
    chat: [],
  });
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getData = async () => {
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");
    axios
      .get(
        `http://localhost:4000/api/v1/db/user?userId=${userId}&accessToken=${accessToken}`
      )
      .then((response) => {
        setUserCred({
          age: response.data.data.userData.age,
          email: response.data.data.userData.email,
          gender: response.data.data.userData.gender,
          summary: response.data.data.userData.summary,
          username: response.data.data.userData.username,
          password: response.data.data.userData.password,
          symptom: response.data.data.userData.symptom,
          userId: response.data.data.userData.userId,
          belief: response.data.data.userData.belief,
          chat: response.data.data.userData.chat,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const getResponseTurbo = async (userInputVal: string, msgCount: number) => {
    let d: Interaction[] = [];
    let userId = localStorage.getItem("UserId");
    let accessToken = localStorage.getItem("AccessToken");

    try {
      const res = await axios.get(
        `http://localhost:9000/api/v1/gpt/response/turbo?userId=${userId}&userInput=${userInputVal}&accessToken=${accessToken}&numberOfMessages=${
          msgCount + 1
        }`
      );
      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response:
              res.data.data.response.content.length > 0
                ? res.data.data.response.content
                : "Tell me more",
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
            date: date,
          },
        ];
        return { ...prev, chat: d };
      });
      axios
        .post(`http://localhost:4000/api/v1/db/chat`, {
          userId: userId,
          accessToken: accessToken,
          chatObject: {
            id: 1,
            key: 1,
            response:
              res.data.data.response.content.length > 0
                ? res.data.data.response.content
                : "Tell me more",
            userInput: userInputVal,
          },
        })
        .then(() => {
          axios
            .get(
              `http://localhost:9000/api/v1/gpt/belief/davinci?userId=${userId}&accessToken=${accessToken}&numberOfMessages=${
                msgCount + 1
              }`
            )
            .then((response) => {
              let belief = response.data.data.belief.toLowerCase().trim();
              axios
                .post(`http://localhost:4000/api/v1/db/belief`, {
                  userId: userId,
                  accessToken: accessToken,
                  belief: belief || "no",
                })
                .then(() => {
                  axios
                    .get(
                      `http://localhost:9000/api/v1/gpt/symptom/davinci?userId=${userId}&accessToken=${accessToken}&numberOfMessages=${
                        msgCount + 1
                      }`
                    )
                    .then((response) => {
                      let symptomText = response.data.data.symptom
                        .toLowerCase()
                        .trim();
                      const extractSymptom = (symptomText: any) => {
                        if (symptomText.includes("no")) {
                          return "no";
                        }

                        const editDistance = (s1: any, s2: any) => {
                          s1 = s1.toLowerCase();
                          s2 = s2.toLowerCase();

                          var costs = new Array();
                          for (var i = 0; i <= s1.length; i++) {
                            var lastValue = i;
                            for (var j = 0; j <= s2.length; j++) {
                              if (i === 0) costs[j] = j;
                              else {
                                if (j > 0) {
                                  var newValue = costs[j - 1];
                                  if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                                    newValue =
                                      Math.min(
                                        Math.min(newValue, lastValue),
                                        costs[j]
                                      ) + 1;
                                  costs[j - 1] = lastValue;
                                  lastValue = newValue;
                                }
                              }
                            }
                            if (i > 0) costs[s2.length] = lastValue;
                          }
                          return costs[s2.length];
                        };

                        const similarity = (s1: any, s2: any) => {
                          var longer = s1;
                          var shorter = s2;
                          if (s1.length < s2.length) {
                            longer = s2;
                            shorter = s1;
                          }
                          var longerLength = longer.length;
                          if (longerLength === 0) {
                            return 1.0;
                          }
                          return (
                            (longerLength - editDistance(longer, shorter)) /
                            parseFloat(longerLength)
                          );
                        };

                        const symptomArray = [
                          "anxiety",
                          "ptsd",
                          "trauma",
                          "short term memory loss",
                          "schizophrenia",
                          "autism",
                          "insomnia",
                          "depression",
                          "phobia",
                          "bipolar",
                          "borderline personality",
                          "alzheimer",
                          "adhd",
                          "headache",
                          "other",
                        ];

                        let mostLikelySymptom = "";
                        let maxSimilarity = 0;

                        symptomArray.forEach((symp) => {
                          const simil = similarity(symptomText, symp);
                          if (simil >= maxSimilarity) {
                            mostLikelySymptom = symp;
                            maxSimilarity = simil;
                          }
                        });

                        return mostLikelySymptom !== ""
                          ? mostLikelySymptom
                          : "no";
                      };

                      let symptom = extractSymptom(symptomText);

                      axios
                        .post(`http://localhost:4000/api/v1/db/symptom`, {
                          userId: userId,
                          accessToken: accessToken,
                          symptom: symptom,
                        })
                        .then(() => {})
                        .catch((error) => {
                          console.log(error.message);
                        });
                    })
                    .catch((error) => {
                      console.log(error.message);
                    });
                })
                .catch((error) => {
                  console.log(error.message);
                });
            })
            .catch((error) => {
              console.log(error.message);
            });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } catch (error) {
      const errorResponse = ["Server Is Down Right Now!!!"];
      const x = 0;
      setUserCred((prev: UserInfo) => {
        d = [
          ...prev.chat.slice(0, -1),
          {
            userInput: userInputVal,
            response: errorResponse[x],
            id: prev.chat[prev.chat.length - 2]?.id
              ? prev.chat[prev.chat.length - 2].id + 1
              : 2,
            key: prev.chat[prev.chat.length - 2]?.key
              ? prev.chat[prev.chat.length - 2].key + 1
              : 2,
            date: date,
          },
        ];
        return { ...prev, chat: d };
      });
    }
    setCount((prevCount) => {
      return prevCount + 1;
    });
  };

  const handleFormSubmit = async (userInputvalue: any) => {
    setUserCred((prev: UserInfo) => {
      return {
        ...prev,
        chat: [
          ...prev.chat,
          {
            userInput: userInputvalue,
            response: "",
            id: 1000000007,
            key: 1000000007,
            date: date,
          },
        ],
      };
    });
    await getResponseTurbo(userInputvalue, msgCount);
  };

  const handleFormChange = (input: string) => {};

  const handleFormClear = () => {
    setUserCred((prev: UserInfo) => {
      return { ...prev, chat: [] };
    });
    props.onClose();
  };

  return (
    <>
      <Chatbot
        onFormChange={handleFormChange}
        onFormSubmit={handleFormSubmit}
        onFormClear={handleFormClear}
        onClose={props.onClose}
        data={userCred.chat}
        chatbotWidth={80}
        chatbotHeight={80}
      ></Chatbot>
    </>
  );
});

interface UserInfo {
  age: number;
  email: string;
  gender: string;
  summary: string;
  username: string;
  chat: Interaction[];
  belief: string;
  symptom: string;
  userId: string;
  password: string;
}
