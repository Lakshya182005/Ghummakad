"use client";
import Image from "next/image";
import React, { useState } from "react";

const About = () => {
  const [imgSrc, setImgSrc] = useState("/Me.jpg");

  return (
    <main className="min-h-screen flex flex-col justify-center bg-white text-gray-800">
      <section className="bg-gradient-to-br from-teal-600 to-red-500 text-white py-20 px-6 text-center flex justify-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4">About Ghummakad</h1>
          <p className="text-xl italic">
            "Because every mother deserves to know — where the adventure leads."
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-6 sm:px-16 text-center flex justify-center">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto text-left">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-teal-600">
              Our Mission
            </h2>
            <p>
              Ghummakad is built for the soul that refuses to stay still — for
              every bus ride, train journey, and mountain trail that shapes who
              we are. Map it. Cherish it. Share it.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4 text-red-500">Our Vision</h2>
            <p>
              To build a space where no story is forgotten, not even the ones
              written between the lines of every journey.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-16 px-6 flex justify-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center font-bold mb-20">Our Values</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              [
                "Adventure",
                "We embrace the thrill of new paths and unplanned detours."
              ],
              ["Simplicity", "We keep things easy, clean, and joyful to use."],
              [
                "Exploration",
                "We encourage curiosity, discovery, and going off the beaten track."
              ],
              [
                "Freedom",
                "We celebrate the spirit to roam wherever the heart leads."
              ],
              [
                "Connection",
                "We help travelers stay close to those who care, no matter the distance."
              ],
              [
                "Storytelling",
                "We believe every journey, even the quiet ones, deserves to be remembered."
              ]
            ].map(([title, desc], idx) =>
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="text-xl font-semibold text-orange-500 mb-2">
                  {title}
                </h3>
                <p className="text-sm">
                  {desc}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 sm:px-20 flex justify-center">
        <div className="flex  items-center gap-10 max-w-6xl mx-auto justify-center">
          <div className="relative w-1/3 aspect-[3/4]  rounded-xl overflow-hidden shadow-md">
            <Image
              src={imgSrc}
              alt="Me"
              fill
              className="object-cover "
              onError={() =>
                setImgSrc(
                  "https://via.placeholder.com/400x300?text=Image+Missing"
                )}
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-teal-600">From Me</h2>
            <p className="text-sm leading-relaxed">
              This project started from my own need to track where I've been —
              to remember the little details that fade, and to share those
              journeys with people who care. I didn't want to build just another
              travel app. I wanted a space where every chai stop, late train,
              sunrise trek, and inside joke with friends could live on — because
              those are the things we forget, but shouldn't. I still remember
              one trip where my mom somehow knew more about my location than I
              did — and another where I deleted all my trip photos because they
              got mixed up. Ghummakad is my way of solving that — for myself,
              and for every other traveler who's ever wandered a little too far.
              Ghummakad is for those who get lost on purpose — and for the moms
              who just want to know their child is okay. ❤️
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
