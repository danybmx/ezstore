if [ -n $NODE_ENV ]
then
  if [ $NODE_ENV = "production" ]
  then
    npm run start
    exit
  fi
fi
npm install && npm run dev
