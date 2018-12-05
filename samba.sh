#!/bin/bash

smbclient "$1" "$2" -U "$3" -c "print $4"