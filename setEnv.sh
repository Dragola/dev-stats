#!/bin/bash

if [ -z $1 ]; then
   echo "Provide your github personal access token"
   exit 1
fi

if [ ! -f ".env" ]; then
   cp ".env.example" ".env"
fi

sed -i '' -re "s/(GITHUB_AUTH=).*/\1$1/g" .env
