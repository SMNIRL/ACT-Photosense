# ACT-Photosense

This is a small ACT overlay that aims to reduce the seizure and headache inducing effects of some intense lighting and screen effects in FFXIV. 

It works by looking for the casts of certain boss spells and applying a timed, semi-transparent black overlay to the screen to dampen the light.

***PLEASE USE WITH CAUTION*** - While this plugin is made with the best intentions, I cannot guarantee it will work for everyone and I cannot gaurentee it will always function.
Use your best judgement and don't get hurt for a video game.

***BETA VERSION WARNING*** - The current version is in active development and may break unexpectedly.
If you used or wish to use this plugin with the 2 encounters it supported previously, please view the old
repository setup instructions [here](https://github.com/kastor-ffxiv/ACT-Photosense). Or use the [v0.1 release](https://github.com/SMNIRL/ACT-Photosense/releases/tag/v0.1) locally.

## Table of Contents
- [Setup/Installation](#installation)
- [Contributing](#contributing)
- [Supported Encounters](#supported-encounters)
  - [Endwalker](#endwalker)
  - [Shadowbringers](#shadowbringers)

# Supported Encounters

# Endwalker
(Work in Progress)

## The Omega Protocol (Ultimate)

### Phase 1
- Bright map change effect prior to Atomic Ray enrage - Darkens screen by 70% for 3 seconds.

# Shadowbringers

## The Tower At Paradigm's Breach (Nier Alliance Raid #3)

### Red Girl
- Cruelty - Darkens screen by 70% for 9 seconds.
- Sublime Transcendence (AKA the Jumpscare) - Completely obscures screen for 10 seconds.

### False Idol/Her Inflorescence
- Transition effect - Darkens screen by 70% for 12 seconds.
- Distortion - Darkens screen by 70% for 9 seconds.

## E12S

- Lion Breath Cones - Darkens screen by 70% for 30 seconds after the Lion Sculptures spawn.


# Installation

1. If you do not yet have it installed, ACT is a requirement to use this overlay. You should install it by following the instructions here: https://github.com/FFXIV-ACT/setup-guide. You can skip the "FFLogs Uploader" section.

2. Open ACT, and click on the `Plugins` tab.
![image](https://user-images.githubusercontent.com/73002107/114977361-8bcfeb00-9e55-11eb-9f2a-81be9c490cff.png)

3. Click on the OverlayPlugin.dll tab in the second menubar. ![image](https://user-images.githubusercontent.com/73002107/114977583-e23d2980-9e55-11eb-87db-b9cb9be89d6c.png)

4. Click the `New` button (A), enter a name (B) (anything is fine), then select a Preset of `Custom` (C) and a Type of `MiniParse`. Then click `OK`. ![image](https://user-images.githubusercontent.com/73002107/114977719-24666b00-9e56-11eb-9c2d-6a4df9a199b0.png)

5. Make sure the new Overlay you created is highlighted in the left panel (A), then enter `https://smnirl.github.io/ACT-Photosense/` in the `URL` field (B) under the General tab, then check `Force white background` (C). *(You may have to scroll down, or enlarge the ACT window to see these options)* ![image](https://user-images.githubusercontent.com/73002107/114978289-09e0c180-9e57-11eb-8105-29830eddd1ce.png)

6. Now, a small white box should appear on your screen. ![image](https://user-images.githubusercontent.com/73002107/114978044-ab1b4800-9e56-11eb-830e-edb8e01d8740.png)

7. Click and drag the box to move it to the **Upper Left** of your screen, then click and drag the **Bottom Right** corner of this box to make it fill the entire FFXIV game window, so it's entirely covered in white. ![Video](https://user-images.githubusercontent.com/73002107/114978698-94c1bc00-9e57-11eb-858c-351b11a4007a.mp4)

8. Uncheck `Force white background`, then check `Enable Clickthrough` (A) and `Lock Overlay` (B). ![image](https://user-images.githubusercontent.com/73002107/114979090-4365fc80-9e58-11eb-8485-bf5dfd6fca50.png)

9. That's it! As long as you have ACT open while you play, the effects listed above should take place automatically.

## Contributing

Pull Requests to this project are welcome! 

If you wish to add an encounter or mechanic, please hold off until I modify the project structure. I plan to
make different encounters their own ES6 classes so that configuration can be included to configure handlers
as desired by the user.

## Planned Improvements
- Customization, so users can easily turn on/off specific effects and adjust the darkness level of dampening.
- Additional encounters/mechanics.
- Audio Warnings before effects.
