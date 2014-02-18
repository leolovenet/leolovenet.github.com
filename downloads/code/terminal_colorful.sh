#!/bin/bash

cd ~
WGET_CMD=$(type -P wget)

if [ $WGET_CMD = "" ];then
     yum -y install wget
fi

wget http://leolovenet.com/downloads/code/dircolors
#or
#wget --no-check-certificate https://github.com/seebi/dircolors-solarized/raw/master/dircolors.ansi-universal

mv dircolors  ~/.dir_colors
eval `dircolors ~/.dir_colors`
cat >>  ~/.bashrc <<END
########bash color######################
if [ -x /usr/bin/dircolors ]; then
    alias ls='ls --color=auto'
    alias dir='dir --color=auto'
    alias vdir='vdir --color=auto'
    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
    alias tree='tree -C'
fi
alias ..="cd .."
alias ..2="cd ../.."
alias ..3="cd ../../.."
alias ..4="cd ../../../.."
alias ..5="cd ../../../../.."
alias  "l"="ls -ahl --full-time"
########################################
END
source ~/.bashrc
ls / 
