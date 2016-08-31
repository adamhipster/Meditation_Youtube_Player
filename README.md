# Meditation_Youtube_Player
Plays a song at the beginning and your end of meditation and can detect your heartrate. Written in Django.

For meditators that do not like to start a meditation cold turkey, this could be a solution to ease more into it and to ease more out of it at the end. Detecting your heartrate is more of a fun gimick (heavily based on [github.com/camilleanne/pulse][1]).

#### Installation
```
virtualenv env
source ./env/bin/activate
pip install -r requirements.txt
```

I had a couple of issues installing libraries from Camileanne her project. So if that part of the installation fails use:
```
sudo port install libsdl +universal
sudo port install glew +universal
```

What also worked was to do a `pip freeze` look at the requirements and install them one by one. For some reason 1 requirement could not be installed via requirements.txt

And if manage.py is not an executable file do:
```
chmod +x ./manage.py
```

### Usage
```
source ./env/bin/activate
./manage.py runserver
```

Go to `localhost:8000`. Also, a modified version of Camileanne her project runs at `localhost:8000/pulse`.

Published under the MIT License.

Old demo: http://jsfiddle.net/mettamage/qp846d57/

[1]: https://github.com/camilleanne/pulse "Pulse"
