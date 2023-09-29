import React, { useState } from "react";
import { gsap, Expo } from "gsap";
import Prompt from "./components/prompt";
import CircularProgress from "@mui/material/CircularProgress";
import SpeedDial from "@mui/material/SpeedDial";
import Box from "@mui/material/Box";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import CustomizedSlider from "./components/upvoteslider";
import Button from '@mui/material/Button';

export default function Form() {
  const backendUrl = "http://localhost:5000";
  const [userInput, setUserInput] = useState("");
  const [generatedStory, setGeneratedStory] = useState("");
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [slidershow, setSliderShow] = useState(true);
  const [like, setLike] = useState(false);
  const [storyId, setStoryId] = useState("");

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleAnimation = () => {
    if (!isFocused) {
      gsap.to(".input-field", {
        height: 600,
        duration: 1,
        ease: Expo.easeInOut,
      });
      gsap.fromTo(
        ".prompt",
        {
          opacity: 1,
        },
        {
          opacity: 0,
          ease: Expo.easeInOut,
        }
      );
      gsap.fromTo(
        ".heading h1",
        {
          scale: 1,
        },
        {
          y: -160,
          scale: 0.5,
          yoyo: true,
          duration: 1,
          ease: Expo.easeInOut,
        }
      );
      gsap.fromTo(
        ".title",
        {
          opacity: 0,
        },
        {
          opacity: 1,
          zIndex: 1,
          delay: 0.5,
          ease: Expo.easeInOut,
        }
      );
    }
  };
  const handlePrompt = (promptt) => {
    setUserInput(promptt);
  };
  const handelRefresh = (location) => {
    location.reload();
  };
  const handleActionClick = (actionName) => {
    switch (actionName) {
      case "Copy":
        break;
      case "Save":
        downloadStory();
        break;
      case "Share":
        handleShare();
        break;
      default:
        break;
    }
  };
  const downloadStory = () => {
    if (!generatedStory) {
      return;
    }

    const blob = new Blob([generatedStory], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-story.txt";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Generated Story",
          text: "Check out this generated story!",
          files: [
            new File([generatedStory], "generated-story.txt", {
              type: "text/plain",
            }),
          ],
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      console.error("Web Share API is not supported in this browser.");
    }
  };

  const generateStory = () => {
    setError(null);
    setGeneratedStory("");
    setIsFocused(true);
    handleAnimation();

    setTimeout(() => {
      setLoading(true);

      fetch(`${backendUrl}/generate-story`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userInput, sliderValue: sliderValue }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setGeneratedStory(data.story);
          setStoryId(data.storyId);
        })
        .catch((error) => {
          setError(error);
          console.error("Error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 1000);
  };
  const actions = [
    { icon: <SaveIcon />, name: "Save" },
    { icon: <ShareIcon />, name: "Share" },
  ];
  const handleSliderSubmission = () => {
    fetch(`${backendUrl}/updatelike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sliderValue: sliderValue, storyId: storyId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // Log the response for debugging
        setSliderShow(false);
        setLike(true);
      })
      .catch((error) => {
        console.error("Error updating like:", error);
        // Handle the error as needed
      });
  };

  return (
    <div className="form-container">
      <div className="heading left-[44%]">
        <h1>
          <span>C</span>loudy
        </h1>
      </div>
      <div className="input-field">
        <div className="bg-[red] h-[35%] w-[25%] absolute top-[30%] left-[-20%] blur-[100px]"></div>
        <div className="bg-[#7ADEDE] h-[35%] w-[4%] absolute top-[30%] right-[2%] blur-[60px]"></div>
        <Button variant="contained" className="absolute left-[73%] top-[85%]"><a href="/leaderboard">Leaderboard</a></Button>
        <div className="grid grid-cols-2 ml-[31%] mxl-8 w-[40%]">

        
          <div style={{ color: "green" }}>
            <Prompt
              icon="fa-solid fa-tree"
              text="Jungle"
              para="Story About Jungle"
              onClick={() => handlePrompt("Jungle")}
            />
          </div>
          <div style={{ color: "purple" }}>
            <Prompt
              icon="fa-brands fa-space-awesome"
              text="Science Fiction"
              para="Story About Science"
              onClick={() => handlePrompt("Scinece Fiction")}
            />
          </div>
          <div style={{ color: "brown" }}>
            <Prompt
              icon="fa-solid fa-landmark-dome"
              text="Historical"
              para="Historical Story"
              onClick={() => handlePrompt("Historical")}
            />
          </div>
          <div style={{ color: "hotpink" }}>
            <Prompt
              icon="fa-regular fa-face-laugh-squint"
              text="Funny"
              para="Funny Story"
              onClick={() => handlePrompt("Funny")}
            />
          </div>
        </div>

        <div className="title absolute bottom-[30%] left-[24%] font-extrabold text-slate-100 opacity-0 z-[-1]">
          <h1 className="text-[15vw]">Cloudy</h1>
        </div>

        <div>
          <input
            type="text"
            placeholder="Enter your Prompt"
            value={userInput}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <button className="submit-btn" onClick={generateStory}>
        <i className="fa-solid fa-paper-plane"></i>
      </button>
      {loading && (
        <div className="loading-animation absolute left-[48%] top-[50%] z-10 w-25 h-1 0">
          <CircularProgress color="secondary" size="5vw" />
        </div>
      )}
      {generatedStory && !loading && (
        <div className="generated-story">
          <div className="story-frame z-10 absolute border-[grey] border-[1px] w-[50%] left-[25%] top-[22%] rounded-l-3xl p-8 font-bold font-serif h-[65%] overflow-y-scroll">
            <p>{generatedStory}</p>
          </div>
          {slidershow && (
            <div className="absolute bottom-[3%] left-[3%] transition-all">
              <CustomizedSlider
                value={sliderValue}
                onChange={handleSliderChange}
              />
            </div>
          )}
          <div>
            <button
              className="absolute left-[20%] bottom-[3%] w-[15%] h-[50px] align-center text-[grey] hover:scale-125 transition-all duration-[3000]"
              onClick={handleSliderSubmission}
            >
              <i className="fa-regular fa-heart text-[250%]"></i>
            </button>
          </div>
          {like && (
            <div>
              <button
                className="absolute left-[20%] bottom-[3%] w-[15%] h-[50px] align-center text-[#fe53a8] hover:scale-125 transition-all"
                onClick={handleSliderSubmission}
              >
                <i class="fa-solid fa-heart text-[250%]"></i>
              </button>
            </div>
          )}

          <div className="relative top-[30%]">
            <Box
              sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}
            >
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "absolute", bottom: 35, right: 300 }}
                icon={<SpeedDialIcon />}
              >
                {actions.map((action) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => handleActionClick(action.name)}
                  />
                ))}
              </SpeedDial>
            </Box>
            
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="error absolute z-[11] top-[20%] left-[23%] w-[58%]">
          <main class="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 ">
            <div class="text-center">
              <p class="text-base font-semibold text-[#57CACA]">404</p>
              <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p class="mt-6 text-base leading-7 text-gray-600">
                Error In Story Genration Please Refresh.
              </p>
              <div class="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={() => handelRefresh(window.location)}
                  class="rounded-md bg-[#57CACA] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C37979] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-[3000]"
                >
                  Refresh
                </button>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
