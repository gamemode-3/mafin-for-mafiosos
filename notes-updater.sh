#!/bin/bash
SOURCE=${BASH_SOURCE[0]}
FILENAME=$(basename "$SOURCE")

autoclose="false"
while [[ $# -gt 0 ]]; do
    case "$1" in
        --autoclose)
            autoclose="true"
            ;;
        *)
    esac
    shift
done

if $autoclose; then
    echo "autoclose is enabled. terminal won't persist unless there is an error."
fi

echo "checking if git is installed..."
if ! git --version &> /dev/null; then
    echo "  git is not installed. opening a new terminal to install it..."
    
    gnome-terminal --wait -- bash -c " \
        echo 'install dependency: git (requires password)'; \
        sudo apt install git"
    if [ $? -ne 0 ]; then
        gnome-terminal -- bash -c " \
            read -p 'failed to install git. press enter to exit.'"
        exit 1
    fi
else
    echo "  git is installed."
fi

echo "checking if git config is set..."
if ! [ -n "$(git config --global user.name)" ] || ! [ -n "$(git config --global user.email)" ]; then
    echo "  git config is not set. opening a new terminal to set it..."
    gnome-terminal --wait -- bash -c " \
        bash -i -c ' \
            echo \"git is not configured. let us set it up.\"; \
            read -p \"enter your name: \" name; \
            git config --global user.name \"\$name\"; \
            read -p \"enter your email: \" email; \
            git config --global user.email \"\$email\"; \
        ' \
    "
    if [ $? -ne 0 ]; then
        gnome-terminal -- bash -c " \
            read -p 'failed to set git config. press enter to exit.'"
        exit 1
    fi
    echo "  git config set to: "
    git config --list
else
    echo "  git config is set."
fi

# Define the GitHub repository URL
github_repo="https://github.com/gamemode-3/mafin-for-mafiosos"

# Configuration file and section
config_dir="$HOME/.mafin_for_mafiosos"
config_file="$config_dir/config"

AUTOSTART_CODE="
    # check whether \"$HOME/.config/autostart/mafin_for_mafiosos.desktop\" already exists
    if [ -f \"$HOME/.config/autostart/mafin_for_mafiosos.desktop\" ]; then
        echo 'autostart is already set up.'
        echo 'if you want to remove it delete \"$HOME/.config/autostart/mafin_for_mafiosos.desktop\".'
    else
        read -p 'would you like your notes to update every time you log in? (y/n) ' autostart
        echo ''
        if [ \"\$autostart\" = \"y\" ]; then
            echo 'setting up autostart...'

            cp $SOURCE "$HOME/.mafin_for_mafiosos/"

            echo \"[Desktop Entry]
            Encoding=UTF-8
            Name=mafin for mafiosos
            Comment=mafin for mafiosos
            Exec=\"$HOME/.mafin_for_mafiosos/$FILENAME\" --autoclose
            Terminal=false
            Type=Application\" > \"$HOME/.config/autostart/mafin_for_mafiosos.desktop\"
            echo 'done!'
        else
            echo 'not setting up autostart. '
        fi
    fi
"

# check if 'local_dir' is set in the config
while true; do
    local_dir=$(grep -Po "(?<=local_dir=).*" "$config_file")
    if [ -n "$local_dir" ]; then
        echo "using existing local directory: $local_dir"
        # trim single quotes around dir using tr
        local_dir=$(echo "$local_dir" | tr -d "'")
        concatenated_dir="$(realpath "$local_dir")/MafIn for Mafiosos"
        echo "local_dir: $local_dir"
        echo "concatenated_dir: $concatenated_dir"
        # check if local_dir exists and is writable
        if ! [ -w "$concatenated_dir" ]; then
            echo "cannot write to $local_dir"
            echo "unsetting local_dir in $config_file"
            sed -i '/local_dir=/d' "$config_file"
            gnome-terminal --wait -- bash -c " \
                read -p 'directory was renamed, moved or deleted. you can select a new location in the next terminal. press enter to proceed.'"
        else
            gnome-terminal --wait -- bash -c " \
                echo '--- git log ---'
                echo ''
                git -C '$concatenated_dir' pull
                git_result=\$?
                echo ''
                echo '---------------'
                echo ''

                if [ \$git_result -eq 0 ]; then

                    if $autoclose; then
                        sleep 0.5
                        exit 0
                    fi

                    echo 'notes updated!'
                    echo ''
                    echo -e \"open \\\"$concatenated_dir\\\" from \\e]8;;http://obsidian.md\\aobsidian\\e]8;;\\a to view the notes. (ctrl+click to open link)\"
                    echo ''
                    $AUTOSTART_CODE
                    echo ''
                    read -p 'press enter to exit.'
                    exit 0
                fi
                read -p 'failed to update notes. delete the folder and re-run the script to re-download from scratch. press enter to exit.'
                exit 1"
            if [ $? -ne 0 ]; then
                exit 1
            fi
            exit 0
        fi
    else
        # Open a gnome-terminal to interactively set the local directory
        gnome-terminal --wait -- bash -c " \
            while true; do
                read -e -p 'enter the folder to put the notes in: ' local_dir
                echo \"\"
                if mkdir -p \"\$local_dir\" 2>/dev/null; then
                    if [ -w \"\$local_dir\" ]; then
                        mkdir -p \"$config_dir\"
                        touch \"$config_file\"
                        echo \"local_dir=\$local_dir\" >> \"$config_file\"

                        local_dir=\$(echo \"\$local_dir\" | sed -e 's/^\"//' -e 's/\"\$//' -e \"s/^'//\" -e \"s/'\$//\")
                        local_dir=\$(echo \"\$local_dir\" | sed 's/\\ / /g')
                        local_dir=\$(echo \"\$local_dir\" | sed -e \"s|^~/|\$HOME/|\")

                        real_dir=\$(realpath \"\$local_dir\")
                        concatenated_dir=\"\$real_dir/MafIn for Mafiosos\"

                        mkdir -p \"\$concatenated_dir\"
                        echo '--- git log ---'
                        echo ''
                        git clone \"$github_repo\" \"\$concatenated_dir\"
                        git_result=\$?
                        echo ''
                        echo '---------------'
                        echo ''

                        if [ \$git_result -eq 0 ]; then
                            echo 'you are all set!'
                            echo ''
                            echo -e \"open \\\"\$concatenated_dir\\\" from \\e]8;;http://obsidian.md\\aobsidian\\e]8;;\\a to view the notes. (ctrl+click to open link)\"
                            echo ''

                            $AUTOSTART_CODE

                            echo ''
                            read -p 'Press enter to exit.'
                            exit
                        fi
                        # check if the directory is empty
                        if ! [ -z \"\$(ls -A \"\$concatenated_dir\")\" ]; then
                            echo \"\\\"\$concatenated_dir\\\" needs to be empty for the inital download!\"
                            echo ''
                            read -p 'press enter to retry.'
                            echo \"\"
                        fi
                    else
                        echo 'directory not writable. try again.'
                    fi
                else
                    echo 'invalid directory. try again.'
                fi
            done
        "
        exit 0
    fi
done