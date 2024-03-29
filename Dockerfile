FROM node:16.11.1

# Create app directory
WORKDIR /usr/src/app

# Copy package.json
COPY ./package*.json ./

# Copy yarn.lock
COPY ./yarn.lock ./

# Fetch dependencies
RUN yarn

# Copy code
COPY . .

# Compile typescript to javascript
RUN yarn build

# Install pm2
RUN npm install pm2 -g

# Entrypoint
CMD [ "yarn", "docker" ]