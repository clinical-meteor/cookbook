

[git-submodules-adding-using-removing-and-updating](https://chrisjean.com/git-submodules-adding-using-removing-and-updating/)  
[Git-Tools-Submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)  


### Add New Submodule  
```


cd software-development-kit
pwd

git branch
git pull origin branch-name

git submodule add http://github.com/path/to-lib utilities/lib-name
git status
git submodule init
git submodule update

git add --all .
git commit -a -m 'lib-name added'
```
