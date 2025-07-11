package es.uah.pablopinas.tfg.auth_service.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Spring configuration for password encoding.
 */
@Configuration
public class PasswordEncoderConfig {

    /**
     * Configures the {@link PasswordEncoder} bean using BCrypt.
     *
     * @return a BCrypt-based {@link PasswordEncoder}
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // strength: 12
    }
}
