#!/bin/bash

SIZE=512

convertToSvg () {
    inkscape -z -w $SIZE -h $SIZE $1.svg -e $2.png
}

# vol_01
for file in vol_01/out/*
do
  FILE_NO_EXT=${file%.*}
  SHAPE_NO=$(basename $FILE_NO_EXT)
  convertToSvg $FILE_NO_EXT gallery/v1/$SHAPE_NO
done


