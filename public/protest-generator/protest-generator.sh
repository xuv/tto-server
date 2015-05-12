#!/bin/bash

# The magic command to get the path where the script works
SCRIPTPATH=${0%/*}
#SCRIPTPATH="/home/juego/Doc/Iterations/oracle/private/protest-generator/"

FONT="CFJackStory-Regular.ttf"

# Default quotes if nothing is provided
FIRST="Make everything perfect!"
SECOND="Give us our Google back!"

FOLDER=".."
OUTPUT="protest-$(date +%Y-%m-%d_%H-%M-%S).jpg"

# Get the arguments passed to the script
while getopts :f:s: option
do
        case "${option}"
        in
                f) FIRST=${OPTARG};;
                s) SECOND=${OPTARG};;
        esac
done

# Create first banner temp text image
convert -background transparent -fill black  -font $SCRIPTPATH/$FONT -gravity Center  -size 600x300 +pointsize  caption:"$FIRST"  $SCRIPTPATH/first-banner.png
convert $SCRIPTPATH/first-banner.png  -background transparent  -virtual-pixel background +distort ScaleRotateTranslate -7 $SCRIPTPATH/first-banner.png 

# Create second banner temp text image
convert -background transparent -fill red  -font $SCRIPTPATH/$FONT -gravity Center  -size 700x400 +pointsize  caption:"$SECOND"  $SCRIPTPATH/second-banner.png
convert $SCRIPTPATH/second-banner.png  -background transparent  -virtual-pixel background +distort ScaleRotateTranslate 11 $SCRIPTPATH/second-banner.png

# Compose it all together
convert -composite $SCRIPTPATH/slogan-empty.jpg $SCRIPTPATH/first-banner.png -geometry +324+694 -compose Multiply $SCRIPTPATH/composed.jpg
convert -composite $SCRIPTPATH/composed.jpg $SCRIPTPATH/second-banner.png -compose Multiply -geometry +922+948 $SCRIPTPATH/composed.jpg
convert -composite -compose Over -geometry +0+0 $SCRIPTPATH/composed.jpg $SCRIPTPATH/slogan-hands.png $SCRIPTPATH/$FOLDER/$OUTPUT

echo $OUTPUT