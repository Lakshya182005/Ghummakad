import Image from "next/image";
import React from "react";

const About = () => {
  return (
    <div>
      <section>
        <h1>About Us</h1>
        <p>
          "Because every mother deserves to know — where the adventure leads."
        </p>
      </section>
      <section>
        <div>
          <h2>Mission</h2>
          <p>
            "Ghummakad is built for the soul that refuses to stay still — for
            every bus ride, train journey, and mountain trail that shapes who we
            are. Map it. Cherish it. Share it."
          </p>
        </div>
        <div>
          <h2>Vision</h2>
          <p>
            "To build a space where no story is forgotten, not even the ones
            written between the lines of every journey."
          </p>
        </div>
      </section>

      <section>
        <div>
          <h2>Adventure</h2>
          <p>We embrace the thrill of new paths and unplanned detours.</p>
        </div>
        <div>
          <h2>Simplicity</h2>
          <p>We keep things easy, clean, and joyful to use.</p>
        </div>
        <div>
          <h2>Exploration</h2>
          <p>
            We encourage curiosity, discovery, and going off the beaten track.
          </p>
        </div>
        <div>
          <h2>Freedom</h2>
          <p>We celebrate the spirit to roam wherever the heart leads.</p>
        </div>
        <div>
          <h2>Connection</h2>
          <p>
            We help travelers stay close to those who care, no matter the
            distance.
          </p>
        </div>
        <div>
          <h2>Storytelling</h2>
          <p>
            We believe every journey, even the quiet ones, deserves to be
            remembered.
          </p>
        </div>
      </section>

      <section className="flex justify-between">
        <div className="relative w-full h-64 md:h-120 overflow-hidden rounded-xl">
          <Image src="/Me.jpg" fill alt="Me" />
        </div>
        <div>
          <h1>From Me</h1>
          <p>
            "This project started from my own need to track where I've been — to
            remember the little details that fade, and to share those journeys
            with people who care. I didn't want to build just another travel
            app. I wanted a space where every chai stop, late train, sunrise
            trek, and inside joke with friends could live on — because those are
            the things we forget, but shouldn't. I still remember one trip where
            my mom somehow knew more about my location than I did — and another
            where I deleted all my trip photos because they got mixed up.
            Ghummakad is my way of solving that — for myself, and for every
            other traveler who's ever wandered a little too far. Ghummakad is
            for those who get lost on purpose — and for the moms who just want
            to know their child is okay. ❤️"
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
