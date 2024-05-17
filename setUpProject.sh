#!bin/bash

# rename project and services
find . -type f -exec sed -i 's/proyecto/nameProject/g' {} +

find . -type f -exec sed -i 's/microservicio/namemicroservicio/g' {} +

# create branch
git commit -am "fist commit"
git branch dev
git branch qa
git commit -am "fist commit"

git push --all

#create job in jenkins
curl -s -XPOST --USER admin:${token_jenkins} 'http://jenkins.appsjamar.com:8080/createItem?name=proyecto-microservicio'  --data-binary @jenkins/configJobJenkins.xml  -H "Content-Type:text/xml"
